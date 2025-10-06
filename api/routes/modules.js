const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db.js');

// Configurar multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else if (file.mimetype.startsWith('application/')) {
      uploadPath += 'documents/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoint para guardar un módulo y sus recursos
router.post('/courses/:courseId/modules', upload.fields([
  { name: 'documents', maxCount: 10 },
  { name: 'videos', maxCount: 10 }
]), async (req, res) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    const { courseId } = req.params;
    const modules = JSON.parse(req.body.modules);
    
    // Guardar cada módulo y sus recursos
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      
      // Insertar el módulo
      const moduleResult = await client.query(
        `INSERT INTO course_modules (course_id, title, description, order_index) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [courseId, module.title, module.description, i + 1]
      );
      
      const moduleId = moduleResult.rows[0].id;
      
      // Guardar los recursos del módulo
      const resources = [];
      
      // Procesar documentos
      if (module.resources.documents) {
        for (const doc of module.resources.documents) {
          if (doc.file) {
            const file = req.files['documents'].find(f => f.originalname === doc.file.name);
            if (file) {
              resources.push({
                module_id: moduleId,
                resource_type: 'document',
                title: doc.name,
                file_path: file.path
              });
            }
          }
        }
      }
      
      // Procesar videos
      if (module.resources.videos) {
        for (const video of module.resources.videos) {
          if (video.type === 'video-url') {
            resources.push({
              module_id: moduleId,
              resource_type: 'video-url',
              url: video.url
            });
          } else if (video.type === 'video-file' && video.file) {
            const file = req.files['videos'].find(f => f.originalname === video.file.name);
            if (file) {
              resources.push({
                module_id: moduleId,
                resource_type: 'video-file',
                title: video.name,
                file_path: file.path
              });
            }
          }
        }
      }
      
      // Procesar enlaces
      if (module.resources.links) {
        for (const link of module.resources.links) {
          resources.push({
            module_id: moduleId,
            resource_type: 'link',
            title: link.description,
            url: link.url
          });
        }
      }
      
      // Insertar todos los recursos
      for (const resource of resources) {
        await client.query(
          `INSERT INTO module_resources 
           (module_id, resource_type, title, description, url, file_path) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            resource.module_id,
            resource.resource_type,
            resource.title,
            resource.description,
            resource.url,
            resource.file_path
          ]
        );
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
    client.release();
  }
});

// Endpoint para obtener los módulos y recursos de un curso
router.get('/courses/:courseId/modules', async (req, res) => {
  const client = await db.connect();
  
  try {
    const { courseId } = req.params;
    
    // Obtener todos los módulos del curso
    const modulesResult = await client.query(
      `SELECT * FROM course_modules 
       WHERE course_id = $1 
       ORDER BY order_index`,
      [courseId]
    );
    
    const modules = modulesResult.rows;
    
    // Obtener los recursos para cada módulo
    for (const module of modules) {
      const resourcesResult = await client.query(
        `SELECT * FROM module_resources 
         WHERE module_id = $1`,
        [module.id]
      );
      
      // Organizar los recursos por tipo
      module.resources = {
        documents: resourcesResult.rows.filter(r => r.resource_type === 'document'),
        videos: resourcesResult.rows.filter(r => r.resource_type.startsWith('video-')),
        links: resourcesResult.rows.filter(r => r.resource_type === 'link')
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
    client.release();
  }
});

module.exports = router;
