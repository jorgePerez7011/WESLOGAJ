import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

// GET: Obtener actualizaciones recientes para un estudiante
router.get('/students/:studentId/updates', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createPool(dbConfig).getConnection();
    const studentId = req.params.studentId;
    
    // Obtener las actualizaciones de los últimos 7 días para los cursos en los que está inscrito el estudiante
    const [updates] = await connection.query(
      `SELECT DISTINCT 
        c.id as course_id,
        c.name as course_name,
        m.id as module_id,
        m.title as module_title,
        m.description as module_description,
        r.id as resource_id,
        r.type as resource_type,
        r.title as resource_title,
        r.description as resource_description,
        r.url,
        r.file_path,
        m.created_at,
        m.updated_at
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN modules m ON c.id = m.course_id
       LEFT JOIN resources r ON m.id = r.module_id
       WHERE e.student_id = ? 
       AND e.status = 'active'
       AND (
         m.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         OR m.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         OR r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       )
       ORDER BY m.created_at DESC, r.created_at DESC`,
      [studentId]
    );

    // Organizar las actualizaciones por curso
    const courseUpdates = updates.reduce((acc, update) => {
      // Si el curso no existe en el acumulador, crearlo
      if (!acc[update.course_id]) {
        acc[update.course_id] = {
          courseId: update.course_id,
          courseName: update.course_name,
          modules: {}
        };
      }

      // Si el módulo no existe en el curso, crearlo
      if (!acc[update.course_id].modules[update.module_id]) {
        acc[update.course_id].modules[update.module_id] = {
          moduleId: update.module_id,
          moduleTitle: update.module_title,
          moduleDescription: update.module_description,
          createdAt: update.created_at,
          updatedAt: update.updated_at,
          resources: []
        };
      }

      // Si hay un recurso, agregarlo al módulo
      if (update.resource_id) {
        const resource = {
          id: update.resource_id,
          type: update.resource_type,
          title: update.resource_title,
          description: update.resource_description,
          url: update.url,
          filePath: update.file_path ? `http://localhost:3000${update.file_path}` : null
        };
        
        // Evitar duplicados de recursos
        if (!acc[update.course_id].modules[update.module_id].resources.find(r => r.id === resource.id)) {
          acc[update.course_id].modules[update.module_id].resources.push(resource);
        }
      }

      return acc;
    }, {});

    // Convertir el objeto en un array y formatear la respuesta
    const formattedUpdates = Object.values(courseUpdates).map(course => ({
      ...course,
      modules: Object.values(course.modules)
    }));

    res.json({
      success: true,
      updates: formattedUpdates
    });
  } catch (error) {
    console.error('Error al obtener actualizaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las actualizaciones: ' + error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export default router;
