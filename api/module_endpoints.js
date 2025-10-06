// Endpoint para crear un nuevo módulo
app.post('/api/courses/:courseId/modules', async (req, res) => {
  const { title, description } = req.body;
  const { courseId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtener el último orden para el curso
    const [lastOrder] = await connection.execute(
      'SELECT MAX(order_index) as lastOrder FROM course_modules WHERE course_id = ?',
      [courseId]
    );
    const newOrder = (lastOrder[0].lastOrder || 0) + 1;

    // Crear el nuevo módulo
    const [result] = await connection.execute(
      'INSERT INTO course_modules (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
      [courseId, title, description, newOrder]
    );

    await connection.end();
    res.json({ 
      success: true, 
      moduleId: result.insertId,
      message: 'Módulo creado correctamente'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para agregar contenido a un módulo
app.post('/api/modules/:moduleId/content', upload.single('file'), async (req, res) => {
  const { moduleId } = req.params;
  const { title, contentType, contentUrl, description } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtener el último orden para el módulo
    const [lastOrder] = await connection.execute(
      'SELECT MAX(order_index) as lastOrder FROM module_content WHERE module_id = ?',
      [moduleId]
    );
    const newOrder = (lastOrder[0].lastOrder || 0) + 1;

    // Si se subió un archivo
    let finalContentUrl = contentUrl;
    if (req.file) {
      finalContentUrl = `/uploads/${req.file.filename}`;
    }

    // Insertar el contenido
    const [result] = await connection.execute(
      'INSERT INTO module_content (module_id, title, content_type, content_url, description, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [moduleId, title, contentType, finalContentUrl, description, newOrder]
    );

    await connection.end();
    res.json({ 
      success: true, 
      contentId: result.insertId,
      message: 'Contenido agregado correctamente'
    });
  } catch (err) {
    // Si hay error y se subió un archivo, eliminarlo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para obtener los módulos de un curso
app.get('/api/courses/:courseId/modules', async (req, res) => {
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
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para obtener el contenido de un módulo
app.get('/api/modules/:moduleId/content', async (req, res) => {
  const { moduleId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [content] = await connection.execute(
      'SELECT * FROM module_content WHERE module_id = ? ORDER BY order_index',
      [moduleId]
    );

    await connection.end();
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
