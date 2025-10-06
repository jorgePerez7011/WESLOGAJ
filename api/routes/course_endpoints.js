import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/courses');
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error al crear el directorio de cursos:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Pool de conexiones a la base de datos
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET: Obtener información de un curso específico
router.get('/courses/:id', async (req, res) => {
  let connection;
  try {
    console.log('Intentando obtener el curso con ID:', req.params.id);
    
    connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida');
    
    // Obtener información básica del curso
    const [courses] = await connection.query(
      `SELECT c.*, t.name as teacher_name, t.email as teacher_email
       FROM courses c 
       LEFT JOIN teachers t ON c.teacher_id = t.id 
       WHERE c.id = ? AND c.active = true`,
      [req.params.id]
    );
    
    console.log('Resultado de la consulta:', courses);

    if (courses.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Curso no encontrado' 
      });
    }

    const course = courses[0];

    // Obtener los módulos del curso
    console.log('Buscando módulos para el curso');
    const [modules] = await connection.query(
      `SELECT id, title, description, 
              created_at, updated_at
       FROM modules 
       WHERE course_id = ? 
       ORDER BY created_at`,
      [req.params.id]
    );
    
    console.log('Módulos encontrados:', modules.length);

    // Para cada módulo, obtener sus recursos
    for (let module of modules) {
      const [resources] = await connection.query(
        `SELECT id, type, title, description, url, file_path,
                created_at, updated_at
         FROM resources 
         WHERE module_id = ?`,
        [module.id]
      );
      
      // Transformar las rutas de archivos en URLs completas
      resources.forEach(resource => {
        if (resource.file_path) {
          // Asegurarse de que la ruta comience con /uploads
          let normalizedPath = resource.file_path;
          if (!normalizedPath.startsWith('/')) {
            normalizedPath = '/' + normalizedPath;
          }
          if (!normalizedPath.startsWith('/uploads')) {
            normalizedPath = '/uploads' + normalizedPath;
          }
          
          // Mantener la ruta normalizada
          resource.file_path = normalizedPath;
          
          console.log('Procesando recurso:', {
            title: resource.title,
            type: resource.type,
            original_path: resource.file_path,
            normalized_path: normalizedPath
          });
        }
      });
      
      module.resources = resources;
    }

    course.modules = modules;
    
    res.json({ 
      success: true, 
      course: course 
    });
  } catch (error) {
    console.error('Error al cargar el curso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cargar el curso: ' + error.message 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// GET: Obtener estudiantes inscritos en un curso
router.get('/courses/:id/students', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [students] = await connection.execute(
      `SELECT s.id, s.name, s.email, e.enrollment_date, e.status 
       FROM students s 
       JOIN enrollments e ON s.id = e.student_id 
       WHERE e.course_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, students });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  } finally {
    if (connection) connection.release();
  }
});

// Configuración de multer para archivos
const moduleStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.fieldname === 'documents' ? 'documents' : 'videos';
    const uploadPath = path.join(__dirname, `../uploads/${fileType}`);
    // Crear el directorio si no existe
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error al crear el directorio:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const moduleUpload = multer({ storage: moduleStorage });

// POST: Crear un nuevo módulo para un curso
router.post('/courses/:id/modules', moduleUpload.fields([
  { name: 'documents', maxCount: 10 },
  { name: 'videos', maxCount: 10 }
]), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    console.log('Creando módulo:', req.body);
    let { title, description, resources } = req.body;
    
    // Validar que title tenga valor
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'El título del módulo es obligatorio' 
      });
    }

    if (!description || description.trim() === '') {
      description = 'Sin descripción';
    }
    
    // Insertar el módulo
    const [moduleResult] = await connection.execute(
      'INSERT INTO modules (course_id, title, description) VALUES (?, ?, ?)',
      [req.params.id, title.trim(), description.trim()]
    );
    
    const moduleId = moduleResult.insertId;

    // Procesar recursos si existen
    if (resources) {
      console.log('Procesando recursos:', resources);
      const resourcesData = JSON.parse(resources);
      
      for (const resource of resourcesData) {
        let filePath = null;
        
        // Si es un recurso de tipo documento o video y hay archivos
        if ((resource.type === 'document' || resource.type === 'video-file') && req.files) {
          const fileType = resource.type === 'document' ? 'documents' : 'videos';
          const files = req.files[fileType];
          
          console.log(`Archivos ${fileType}:`, files);
          
          if (files && files.length > 0) {
            const file = files.shift(); // Tomar el primer archivo disponible
            filePath = `/uploads/${fileType}/${file.filename}`;
            console.log('Archivo procesado:', filePath);
          } else {
            console.log(`No se encontraron archivos para el tipo ${fileType}`);
          }
        }

        // Insertar el recurso
        await connection.execute(
          `INSERT INTO resources 
           (module_id, type, title, description, url, file_path) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            moduleId,
            resource.type,
            resource.title,
            resource.description || null,
            resource.url || null,
            filePath
          ]
        );
      }
    }

    await connection.commit();
    console.log('Módulo creado:', moduleResult);
    res.json({ 
      success: true, 
      moduleId: moduleResult.insertId,
      message: 'Módulo y recursos creados exitosamente'
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error al crear módulo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar los módulos y recursos: ' + error.message 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// POST: Subir imagen del curso
router.post('/courses/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se proporcionó ninguna imagen' });
    }

    const connection = await pool.getConnection();
    const imageUrl = `/uploads/courses/${req.file.filename}`;
    
    await connection.query(
      'UPDATE courses SET image_url = ? WHERE id = ?',
      [imageUrl, req.params.id]
    );

    connection.release();
    res.json({ success: true, image_url: imageUrl });
  } catch (error) {
    console.error('Error al subir la imagen del curso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al subir la imagen del curso: ' + error.message 
    });
  }
});

// PUT: Actualizar información del curso
router.put('/courses/:id', upload.none(), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const courseId = req.params.id;
    
    console.log('Datos recibidos:', req.body);
    
    const {
      name, description, course_type, duration, price,
      objectives, requirements, start_date, end_date,
      schedule, max_students, modules
    } = req.body;

    // Actualizar información básica del curso
    await connection.query(
      `UPDATE courses SET 
       name = ?, description = ?, course_type = ?, duration = ?,
       price = ?, objectives = ?, requirements = ?, start_date = ?,
       end_date = ?, schedule = ?, max_students = ?
       WHERE id = ?`,
      [name, description, course_type, duration, price,
       objectives, requirements, start_date, end_date,
       schedule, max_students, courseId]
    );

    // Actualizar módulos y recursos
    const modulesData = typeof modules === 'string' ? JSON.parse(modules) : modules;
    
    if (modulesData && modulesData.length > 0) {
      // Primero, borrar todos los recursos existentes de los módulos
      const [existingModules] = await connection.query(
        'SELECT id FROM modules WHERE course_id = ?',
        [courseId]
      );
      
      for (const module of existingModules) {
        await connection.query(
          'DELETE FROM resources WHERE module_id = ?',
          [module.id]
        );
      }
      
      // Luego, borrar todos los módulos existentes
      await connection.query(
        'DELETE FROM modules WHERE course_id = ?',
        [courseId]
      );
      
      // Finalmente, crear los nuevos módulos y recursos
      for (const module of modulesData) {
        // Crear nuevo módulo
        const [moduleResult] = await connection.query(
          'INSERT INTO modules (course_id, title, description) VALUES (?, ?, ?)',
          [courseId, module.title, module.description]
        );
        
        const newModuleId = moduleResult.insertId;
        
        // Procesar recursos del módulo
        if (module.resources && module.resources.length > 0) {
          for (const resource of module.resources) {
            await connection.query(
              'INSERT INTO resources (module_id, type, title, url, description) VALUES (?, ?, ?, ?, ?)',
              [newModuleId, resource.type, resource.title, resource.url || null, resource.description || null]
            );
          }
        }
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Curso actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el curso: ' + error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// PUT: Actualizar estado de inscripción de un estudiante
router.put('/enrollments/:id/status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { status } = req.body;
    
    await connection.query(
      'UPDATE enrollments SET status = ? WHERE student_id = ?',
      [status, req.params.id]
    );

    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// DELETE: Eliminar un módulo
router.delete('/modules/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Primero eliminar los recursos asociados al módulo
    await connection.query(
      'DELETE FROM resources WHERE module_id = ?',
      [req.params.id]
    );

    // Luego eliminar el módulo
    await connection.query(
      'DELETE FROM modules WHERE id = ?',
      [req.params.id]
    );

    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;
