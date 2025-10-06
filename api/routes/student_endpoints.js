import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

// Obtener estudiantes inscritos en un curso
router.get('/api/courses/:courseId/students', async (req, res) => {
  const { courseId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [students] = await connection.execute(`
      SELECT s.id, s.name, s.email, e.enrollment_date, e.status
      FROM students s
      INNER JOIN enrollments e ON s.id = e.student_id
      WHERE e.course_id = ?
      ORDER BY e.enrollment_date DESC
    `, [courseId]);

    await connection.end();
    
    res.json({
      success: true,
      students: students.map(student => ({
        ...student,
        enrollment_date: student.enrollment_date.toISOString().split('T')[0]
      }))
    });
  } catch (err) {
    console.error('Error al obtener estudiantes:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de estudiantes'
    });
  }
});

// Actualizar el estado de inscripción de un estudiante
router.put('/api/enrollments/:enrollmentId/status', async (req, res) => {
  const { enrollmentId } = req.params;
  const { status } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE enrollments SET status = ? WHERE id = ?',
      [status, enrollmentId]
    );

    await connection.end();
    
    res.json({
      success: true,
      message: 'Estado de inscripción actualizado correctamente'
    });
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de inscripción'
    });
  }
});

export default router;
