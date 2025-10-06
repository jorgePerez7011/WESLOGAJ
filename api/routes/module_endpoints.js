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

// Crear un nuevo módulo para un curso
router.post('/api/courses/:courseId/modules', async (req, res) => {
  const { courseId } = req.params;
  const { title, description } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Obtener el último order_index
    const [lastModule] = await connection.execute(
      'SELECT MAX(order_index) as last_index FROM course_modules WHERE course_id = ?',
      [courseId]
    );
    const newOrderIndex = (lastModule[0].last_index || 0) + 1;

    // Insertar el nuevo módulo
    const [result] = await connection.execute(
      'INSERT INTO course_modules (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
      [courseId, title, description, newOrderIndex]
    );

    await connection.end();
    res.json({ 
      success: true, 
      moduleId: result.insertId,
      message: 'Módulo creado correctamente'
    });

  } catch (err) {
    console.error('Error al crear el módulo:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Obtener todos los módulos de un curso
router.get('/api/courses/:courseId/modules', async (req, res) => {
  const { courseId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [modules] = await connection.execute(
      `SELECT m.*, 
              (SELECT COUNT(*) FROM module_content mc WHERE mc.module_id = m.id) as content_count
       FROM course_modules m 
       WHERE m.course_id = ?
       ORDER BY m.order_index`,
      [courseId]
    );

    await connection.end();
    res.json({ success: true, modules });

  } catch (err) {
    console.error('Error al obtener los módulos:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Obtener un módulo específico con su contenido
router.get('/api/modules/:moduleId', async (req, res) => {
  const { moduleId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtener detalles del módulo
    const [modules] = await connection.execute(
      'SELECT * FROM course_modules WHERE id = ?',
      [moduleId]
    );

    if (modules.length === 0) {
      await connection.end();
      return res.status(404).json({ 
        success: false, 
        message: 'Módulo no encontrado' 
      });
    }

    // Obtener el contenido del módulo
    const [content] = await connection.execute(
      'SELECT * FROM module_content WHERE module_id = ? ORDER BY order_index',
      [moduleId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      module: {
        ...modules[0],
        content
      }
    });

  } catch (err) {
    console.error('Error al obtener el módulo:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Actualizar un módulo
router.put('/api/modules/:moduleId', async (req, res) => {
  const { moduleId } = req.params;
  const { title, description } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE course_modules SET title = ?, description = ? WHERE id = ?',
      [title, description, moduleId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Módulo actualizado correctamente' 
    });

  } catch (err) {
    console.error('Error al actualizar el módulo:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar un módulo
router.delete('/api/modules/:moduleId', async (req, res) => {
  const { moduleId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Primero eliminar todo el contenido del módulo (la FK ON DELETE CASCADE se encargará)
    await connection.execute(
      'DELETE FROM course_modules WHERE id = ?',
      [moduleId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Módulo eliminado correctamente'
    });

  } catch (err) {
    console.error('Error al eliminar el módulo:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Agregar contenido a un módulo
router.post('/api/modules/:moduleId/content', async (req, res) => {
  const { moduleId } = req.params;
  const { content_type, content } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Obtener el último order_index del contenido
    const [lastContent] = await connection.execute(
      'SELECT MAX(order_index) as last_index FROM module_content WHERE module_id = ?',
      [moduleId]
    );
    const newOrderIndex = (lastContent[0].last_index || 0) + 1;

    // Insertar el nuevo contenido
    const [result] = await connection.execute(
      'INSERT INTO module_content (module_id, content_type, content, order_index) VALUES (?, ?, ?, ?)',
      [moduleId, content_type, content, newOrderIndex]
    );

    await connection.end();
    res.json({ 
      success: true, 
      contentId: result.insertId,
      message: 'Contenido agregado correctamente'
    });

  } catch (err) {
    console.error('Error al agregar contenido:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Actualizar contenido de un módulo
router.put('/api/content/:contentId', async (req, res) => {
  const { contentId } = req.params;
  const { content_type, content } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE module_content SET content_type = ?, content = ? WHERE id = ?',
      [content_type, content, contentId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Contenido actualizado correctamente'
    });

  } catch (err) {
    console.error('Error al actualizar contenido:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar contenido de un módulo
router.delete('/api/content/:contentId', async (req, res) => {
  const { contentId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'DELETE FROM module_content WHERE id = ?',
      [contentId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Contenido eliminado correctamente'
    });

  } catch (err) {
    console.error('Error al eliminar contenido:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reordenar módulos
router.put('/api/courses/:courseId/modules/reorder', async (req, res) => {
  const { courseId } = req.params;
  const { moduleIds } = req.body; // Array de IDs en el nuevo orden

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Actualizar el order_index de cada módulo
    for (let i = 0; i < moduleIds.length; i++) {
      await connection.execute(
        'UPDATE course_modules SET order_index = ? WHERE id = ? AND course_id = ?',
        [i + 1, moduleIds[i], courseId]
      );
    }

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Módulos reordenados correctamente'
    });

  } catch (err) {
    console.error('Error al reordenar módulos:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reordenar contenido dentro de un módulo
router.put('/api/modules/:moduleId/content/reorder', async (req, res) => {
  const { moduleId } = req.params;
  const { contentIds } = req.body; // Array de IDs en el nuevo orden

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Actualizar el order_index de cada contenido
    for (let i = 0; i < contentIds.length; i++) {
      await connection.execute(
        'UPDATE module_content SET order_index = ? WHERE id = ? AND module_id = ?',
        [i + 1, contentIds[i], moduleId]
      );
    }

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Contenido reordenado correctamente'
    });

  } catch (err) {
    console.error('Error al reordenar contenido:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
