import express from 'express';
import multer from 'multer';
import path from 'path';
import mysql from 'mysql2/promise';

export const router = express.Router();

// Configuración de multer para archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else if (file.mimetype.startsWith('application/')) {
      uploadPath += 'documents/';
    }
    cb(null, path.join(process.cwd(), uploadPath));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

// Endpoint para guardar módulos y recursos
router.post('/api/courses/:courseId/modules', 
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'videos', maxCount: 10 }
  ]), 
  async (req, res) => {
    const client = await mysql.createConnection(dbConfig);
    
    try {
      await client.query('BEGIN');
      console.log('Recibido: ', req.body);
      
      const { courseId } = req.params;
      
      // Verificar si el curso existe
      const [courseExists] = await client.execute(
        'SELECT id FROM courses WHERE id = ?',
        [courseId]
      );

      if (courseExists.length === 0) {
        throw new Error('El curso no existe');
      }

      // Obtener los módulos existentes para eliminar sus recursos
      const [existingModules] = await client.execute(
        'SELECT id FROM modules WHERE course_id = ?',
        [courseId]
      );

      // Eliminar recursos y módulos existentes
      for (const module of existingModules) {
        await client.execute(
          'DELETE FROM resources WHERE module_id = ?',
          [module.id]
        );
      }

      await client.execute(
        'DELETE FROM modules WHERE course_id = ?',
        [courseId]
      );

      const modules = JSON.parse(req.body.modules);
      
      // Guardar cada módulo y sus recursos
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        
        // Insertar el módulo
        const [moduleResult] = await client.execute(
          `INSERT INTO modules (course_id, title, description) 
           VALUES (?, ?, ?)`,
          [courseId, module.title, module.description]
        );
        
        const moduleId = moduleResult.insertId;
        
        // Procesar los recursos
        for (const resource of module.resources) {
          switch (resource.type) {
            case 'document':
              if (req.files?.['documents']) {
                const file = req.files['documents'].find(f => f.originalname === resource.file_name);
                if (file) {
                  await client.execute(
                    `INSERT INTO resources 
                     (module_id, type, title, file_path) 
                     VALUES (?, ?, ?, ?)`,
                    [moduleId, 'document', resource.title, file.path]
                  );
                }
              }
              break;
              
            case 'video-url':
              await client.execute(
                `INSERT INTO module_resources 
                 (module_id, resource_type, title, url) 
                 VALUES (?, ?, ?, ?)`,
                [moduleId, 'video-url', resource.title, resource.url]
              );
              break;
              
            case 'video-file':
              if (req.files?.['videos']) {
                const file = req.files['videos'].find(f => f.originalname === resource.file_name);
                if (file) {
                  await client.execute(
                    `INSERT INTO module_resources 
                     (module_id, resource_type, title, file_path) 
                     VALUES (?, ?, ?, ?)`,
                    [moduleId, 'video-file', resource.title, file.path]
                  );
                }
              }
              break;
              
            case 'link':
              await client.execute(
                `INSERT INTO module_resources 
                 (module_id, resource_type, title, url) 
                 VALUES (?, ?, ?, ?)`,
                [moduleId, 'link', resource.title, resource.url]
              );
              break;
          }
        }
      }
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Módulos y recursos guardados exitosamente'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al guardar módulos y recursos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al guardar los módulos y recursos'
      });
    } finally {
      client.end();
    }
});

// Endpoint para obtener módulos y recursos
router.get('/api/courses/:courseId/modules', async (req, res) => {
  const client = await mysql.createConnection(dbConfig);
  
  try {
    const { courseId } = req.params;
    
    // Verificar que el curso existe
    const [courseExists] = await client.execute(
      'SELECT id FROM courses WHERE id = ?',
      [courseId]
    );

    if (courseExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    // Obtener todos los módulos del curso
    const [modules] = await client.execute(
      `SELECT * FROM course_modules 
       WHERE course_id = ? 
       ORDER BY order_index`,
      [courseId]
    );
    
    // Obtener los recursos para cada módulo
    for (const module of modules) {
      const [resources] = await client.execute(
        `SELECT * FROM module_resources 
         WHERE module_id = ?`,
        [module.id]
      );
      
      // Organizar los recursos por tipo con la estructura correcta
      module.resources = {
        documents: resources
          .filter(r => r.resource_type === 'document')
          .map(doc => ({
            type: 'document',
            title: doc.title || '',
            file_path: doc.file_path
          })),
        videos: resources
          .filter(r => r.resource_type.startsWith('video-'))
          .map(video => ({
            type: video.resource_type,
            title: video.title || '',
            ...(video.resource_type === 'video-url' 
              ? { url: video.url }
              : { file_path: video.file_path }
            )
          })),
        links: resources
          .filter(r => r.resource_type === 'link')
          .map(link => ({
            type: 'link',
            title: link.title || '',
            url: link.url,
            description: link.description
          }))
      };
    }
    
    res.json({
      success: true,
      modules: modules
    });
  } catch (error) {
    console.error('Error al obtener módulos y recursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los módulos y recursos'
    });
  } finally {
    client.end();
  }
});


