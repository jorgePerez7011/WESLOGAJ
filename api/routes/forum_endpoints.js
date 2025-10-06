import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// GET: Obtener mensajes del foro para un curso específico
router.get('/courses/:courseId/forum', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [posts] = await connection.execute(`
      SELECT 
        fp.*,
        CASE 
          WHEN fp.user_type = 'student' THEN s.name
          WHEN fp.user_type = 'teacher' THEN t.name
        END as user_name,
        CASE 
          WHEN fp.user_type = 'student' THEN s.image_url
          WHEN fp.user_type = 'teacher' THEN t.image_url
        END as user_image
      FROM forum_posts fp
      LEFT JOIN students s ON fp.user_type = 'student' AND fp.user_id = s.id
      LEFT JOIN teachers t ON fp.user_type = 'teacher' AND fp.user_id = t.id
      WHERE fp.course_id = ?
      ORDER BY fp.created_at DESC
    `, [req.params.courseId]);

    // Formatear las fechas
    const formattedPosts = posts.map(post => ({
      ...post,
      created_at: new Date(post.created_at).toLocaleString('es-ES'),
      updated_at: new Date(post.updated_at).toLocaleString('es-ES')
    }));

    res.json({ 
      success: true, 
      posts: formattedPosts 
    });
  } catch (error) {
    console.error('Error al obtener mensajes del foro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cargar los mensajes del foro' 
    });
  } finally {
    if (connection) connection.release();
  }
});

// POST: Crear un nuevo mensaje en el foro
router.post('/courses/:courseId/forum', async (req, res) => {
  let connection;
  try {
    const { userId, userType, message } = req.body;
    
    if (!userId || !userType || !message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    connection = await pool.getConnection();
    
    const [result] = await connection.execute(`
      INSERT INTO forum_posts (course_id, user_id, user_type, message)
      VALUES (?, ?, ?, ?)
    `, [req.params.courseId, userId, userType, message.trim()]);

    // Obtener el mensaje recién creado con la información del usuario
    const [posts] = await connection.execute(`
      SELECT 
        fp.*,
        CASE 
          WHEN fp.user_type = 'student' THEN s.name
          WHEN fp.user_type = 'teacher' THEN t.name
        END as user_name,
        CASE 
          WHEN fp.user_type = 'student' THEN s.image_url
          WHEN fp.user_type = 'teacher' THEN t.image_url
        END as user_image
      FROM forum_posts fp
      LEFT JOIN students s ON fp.user_type = 'student' AND fp.user_id = s.id
      LEFT JOIN teachers t ON fp.user_type = 'teacher' AND fp.user_id = t.id
      WHERE fp.id = ?
    `, [result.insertId]);

    const post = {
      ...posts[0],
      created_at: new Date(posts[0].created_at).toLocaleString('es-ES'),
      updated_at: new Date(posts[0].updated_at).toLocaleString('es-ES')
    };

    res.json({ 
      success: true, 
      message: 'Mensaje publicado exitosamente',
      post
    });
  } catch (error) {
    console.error('Error al crear mensaje en el foro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al publicar el mensaje' 
    });
  } finally {
    if (connection) connection.release();
  }
});

// DELETE: Eliminar un mensaje del foro (solo el autor puede eliminar su mensaje)
router.delete('/forum/:postId', async (req, res) => {
  let connection;
  try {
    const { userId, userType } = req.body;

    connection = await pool.getConnection();
    
    // Verificar que el usuario sea el autor del mensaje
    const [post] = await connection.execute(
      'SELECT * FROM forum_posts WHERE id = ? AND user_id = ? AND user_type = ?',
      [req.params.postId, userId, userType]
    );

    if (post.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para eliminar este mensaje' 
      });
    }

    await connection.execute(
      'DELETE FROM forum_posts WHERE id = ?',
      [req.params.postId]
    );

    res.json({ 
      success: true, 
      message: 'Mensaje eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar mensaje del foro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el mensaje' 
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
