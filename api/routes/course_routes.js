import express from 'express';
import multer from 'multer';
import path from 'path';
import mysql from 'mysql2/promise';
import fs from 'fs';

export const router = express.Router();

// Configuración de multer para las imágenes de los cursos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads', 'courses');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp)'));
  }
});

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

// CREATE - Crear un nuevo curso
router.post('/api/courses', upload.single('image'), async (req, res) => {
  const client = await mysql.createConnection(dbConfig);
  try {
    const {
      name,
      description,
      course_type,
      duration,
      price,
      teacher_id,
      objectives,
      requirements,
      start_date,
      end_date,
      schedule,
      max_students
    } = req.body;

    // Validar campos requeridos
    if (!name || !description || !course_type || !duration || !teacher_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    const image_url = req.file ? `/uploads/courses/${req.file.filename}` : null;

    const [result] = await client.execute(
      `INSERT INTO courses (
        name, description, course_type, duration, price, teacher_id,
        objectives, requirements, start_date, end_date, schedule,
        max_students, image_url, created_at, updated_at, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
      [
        name, description, course_type, duration, price || 0, teacher_id,
        objectives || null, requirements || null, start_date || null,
        end_date || null, schedule || null, max_students || null, image_url
      ]
    );

    res.json({
      success: true,
      message: 'Curso creado exitosamente',
      courseId: result.insertId
    });
  } catch (error) {
    console.error('Error al crear el curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el curso'
    });
  } finally {
    client.end();
  }
});

// READ - Obtener un curso específico con todos sus detalles
router.get('/api/courses/:id', async (req, res) => {
  const client = await mysql.createConnection(dbConfig);
  try {
    const [courses] = await client.execute(
      `SELECT c.*, t.name as teacher_name, t.specialty as teacher_specialty
       FROM courses c
       LEFT JOIN teachers t ON c.teacher_id = t.id
       WHERE c.id = ? AND c.active = 1`,
      [req.params.id]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Obtener los módulos del curso
    const [modules] = await client.execute(
      `SELECT cm.*, mr.* 
       FROM course_modules cm
       LEFT JOIN module_resources mr ON cm.id = mr.module_id
       WHERE cm.course_id = ?
       ORDER BY cm.order_index`,
      [req.params.id]
    );

    // Organizar los módulos y sus recursos
    const organizedModules = modules.reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = {
          id: curr.id,
          title: curr.title,
          description: curr.description,
          order_index: curr.order_index,
          resources: []
        };
      }
      if (curr.resource_id) {
        acc[curr.id].resources.push({
          id: curr.resource_id,
          type: curr.resource_type,
          title: curr.title,
          url: curr.url,
          file_path: curr.file_path,
          description: curr.description
        });
      }
      return acc;
    }, {});

    const course = {
      ...courses[0],
      modules: Object.values(organizedModules)
    };

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Error al obtener el curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el curso'
    });
  } finally {
    client.end();
  }
});

// UPDATE - Actualizar un curso existente
router.put('/api/courses/:id', upload.single('image'), async (req, res) => {
  const client = await mysql.createConnection(dbConfig);
  try {
    const courseId = req.params.id;
    const {
      name,
      description,
      course_type,
      duration,
      price,
      teacher_id,
      objectives,
      requirements,
      start_date,
      end_date,
      schedule,
      max_students
    } = req.body;

    // Obtener el curso existente
    const [existingCourse] = await client.execute(
      'SELECT image_url FROM courses WHERE id = ?',
      [courseId]
    );

    if (existingCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    let image_url = existingCourse[0].image_url;

    // Si hay una nueva imagen, eliminar la anterior y actualizar
    if (req.file) {
      if (image_url) {
        const oldImagePath = path.join(process.cwd(), image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/courses/${req.file.filename}`;
    }

    await client.execute(
      `UPDATE courses SET
        name = ?, description = ?, course_type = ?, duration = ?,
        price = ?, teacher_id = ?, objectives = ?, requirements = ?,
        start_date = ?, end_date = ?, schedule = ?, max_students = ?,
        image_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name, description, course_type, duration,
        price || 0, teacher_id, objectives || null, requirements || null,
        start_date || null, end_date || null, schedule || null,
        max_students || null, image_url, courseId
      ]
    );

    res.json({
      success: true,
      message: 'Curso actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el curso'
    });
  } finally {
    client.end();
  }
});

// DELETE - Eliminar un curso (borrado lógico)
router.delete('/api/courses/:id', async (req, res) => {
  const client = await mysql.createConnection(dbConfig);
  try {
    const courseId = req.params.id;

    // Verificar si el curso existe
    const [existingCourse] = await client.execute(
      'SELECT id FROM courses WHERE id = ? AND active = 1',
      [courseId]
    );

    if (existingCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Realizar borrado lógico
    await client.execute(
      'UPDATE courses SET active = 0, updated_at = NOW() WHERE id = ?',
      [courseId]
    );

    res.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar el curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el curso'
    });
  } finally {
    client.end();
  }
});

// Obtener lista de cursos con filtros
router.get('/api/courses', async (req, res) => {
  const client = await mysql.createConnection(dbConfig);
  try {
    const { 
      course_type, 
      teacher_id, 
      search,
      active = true
    } = req.query;

    let query = `
      SELECT c.*, t.name as teacher_name, t.specialty as teacher_specialty,
             (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrolled_students
      FROM courses c
      LEFT JOIN teachers t ON c.teacher_id = t.id
      WHERE c.active = ?
    `;
    const params = [active === 'true' ? 1 : 0];

    if (course_type) {
      query += ' AND c.course_type = ?';
      params.push(course_type);
    }

    if (teacher_id) {
      query += ' AND c.teacher_id = ?';
      params.push(teacher_id);
    }

    if (search) {
      query += ' AND (c.name LIKE ? OR c.description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY c.created_at DESC';

    const [courses] = await client.execute(query, params);

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los cursos'
    });
  } finally {
    client.end();
  }
});
