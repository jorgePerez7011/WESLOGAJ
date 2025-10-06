import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import courseEndpoints from './routes/course_endpoints.js';
import studentUpdatesRouter from './routes/student_updates.js';
import forumEndpoints from './routes/forum_endpoints.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Crear directorios de uploads si no existen
const uploadsDir = path.join(process.cwd(), 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const documentsDir = path.join(uploadsDir, 'documents');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir);
}

// Configurar cabeceras CORS específicas para archivos
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, path) => {
    // Configurar Content-Disposition para forzar la descarga
    if (path.includes('/documents/') || path.includes('/videos/')) {
      const filename = path.split('/').pop();
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
  }
}));

// Usar las rutas de cursos
app.use('/api', courseEndpoints);

// Usar las rutas de actualizaciones de estudiantes
app.use('/api', studentUpdatesRouter);

// Usar las rutas del foro
app.use('/api', forumEndpoints);

// Configurar multer para la subida de imágenes

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // límite de 5MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png)'))
  }
});

// Endpoint de prueba
app.get('/api/test', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('SELECT 1');
    await connection.end();
    res.json({ success: true, message: 'Conexión a la base de datos exitosa' });
  } catch (err) {
    console.error('Error de prueba:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db',
};

// Crear tabla de cursos si no existe
const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        course_type VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        duration INT NOT NULL,
        price DECIMAL(10,2) DEFAULT 0,
        teacher_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT true,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
      )
    `);

    await connection.end();
    console.log('Base de datos inicializada correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }
};

// Inicializar la base de datos al arrancar el servidor
const initEnrollmentsTable = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    await connection.end();
    console.log('Tabla enrollments inicializada correctamente');
  } catch (err) {
    console.error('Error al inicializar la tabla enrollments:', err);
  }
};

initDatabase();
initEnrollmentsTable();

// Endpoint de registro de estudiante
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, document_type, document_number, country } = req.body;
  if (!name || !email || !password || !document_type || !document_number || !country) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar si el email ya está registrado
    const [existingStudent] = await connection.execute(
      'SELECT id FROM students WHERE email = ?',
      [email]
    );
    
    if (existingStudent.length > 0) {
      await connection.end();
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }
    
    const sql = `INSERT INTO students (name, email, password, phone, document_type, document_number, country, created_at, updated_at, active) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`;
    await connection.execute(sql, [name, email, password, phone || '', document_type, document_number, country]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint de registro de profesor
app.post('/api/register/teacher', async (req, res) => {
  const { name, email, password, phone, document_type, document_number, specialty, country } = req.body;
  if (!name || !email || !password || !document_type || !document_number || !specialty || !country) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar si el email ya está registrado
    const [existingTeacher] = await connection.execute(
      'SELECT id FROM teachers WHERE email = ?',
      [email]
    );
    
    if (existingTeacher.length > 0) {
      await connection.end();
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }
    
    const sql = `INSERT INTO teachers (name, email, password, phone, document_type, document_number, specialty, country, created_at, updated_at, active) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`;
    await connection.execute(sql, [name, email, password, phone || '', document_type, document_number, specialty, country]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint de login de estudiante
app.post('/api/login/student', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan campos' });
  }
  try {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Conexión a la base de datos establecida');
    } catch (dbError) {
      console.error('Error de conexión a la base de datos:', dbError);
      return res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
    }

    const [results] = await connection.execute(
      `SELECT id, name, email, phone, document_type, document_number, country, image_url
       FROM students WHERE email = ? AND password = ? AND active = 1`,
      [email, password]
    );
    await connection.end();
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    
    const user = results[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        document_type: user.document_type,
        document_number: user.document_number,
        country: user.country,
        image_url: user.image_url,
        role: 'student'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint de login de profesor
app.post('/api/login/teacher', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan campos' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      `SELECT id, name, email, phone, document_type, document_number, specialty, country, image_url
       FROM teachers WHERE email = ? AND password = ? AND active = 1`,
      [email, password]
    );
    await connection.end();
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    
    const user = results[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        document_type: user.document_type,
        document_number: user.document_number,
        specialty: user.specialty,
        country: user.country,
        image_url: user.image_url,
        role: 'teacher'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para listar todos los cursos disponibles
app.get('/api/courses', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [courses] = await connection.execute(
      `SELECT c.*, t.name as teacher_name 
       FROM courses c 
       LEFT JOIN teachers t ON c.teacher_id = t.id 
       WHERE c.active = 1`
    );
    await connection.end();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para ver detalles de un curso específico
app.get('/api/courses/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [courses] = await connection.execute(
      `SELECT c.*, t.name as teacher_name, t.specialty 
       FROM courses c 
       LEFT JOIN teachers t ON c.teacher_id = t.id 
       WHERE c.id = ? AND c.active = 1`,
      [req.params.id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    }
    
    await connection.end();
    res.json({ success: true, course: courses[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para inscribirse en un curso
app.post('/api/enrollments', async (req, res) => {
  const { studentId, courseName, courseType, duration, price } = req.body;
  
  // Log para debugging
  console.log('Datos recibidos:', { studentId, courseName, courseType, duration, price });
  
  if (!studentId || !courseName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos obligatorios',
      details: {
        studentId: !studentId ? 'Falta ID del estudiante' : 'OK',
        courseName: !courseName ? 'Falta nombre del curso' : 'OK'
      }
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Buscar o crear el curso
    const [existingCourse] = await connection.execute(
      'SELECT id FROM courses WHERE name = ? AND course_type = ?',
      [courseName, courseType]
    );

    let courseId;
    if (existingCourse.length === 0) {
      // Crear el curso si no existe
      const [result] = await connection.execute(
        'INSERT INTO courses (name, course_type, duration, price, description, created_at, updated_at, active) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 1)',
        [courseName, courseType, duration, price, 'Técnicas avanzadas de manejo defensivo para prevenir accidentes.']
      );
      courseId = result.insertId;
    } else {
      courseId = existingCourse[0].id;
    }

    // Verificar si el estudiante ya está inscrito
    const [existing] = await connection.execute(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );

    if (existing.length > 0) {
      await connection.end();
      return res.status(400).json({ success: false, message: 'Ya estás inscrito en este curso' });
    }

    // Crear la inscripción
    await connection.execute(
      'INSERT INTO enrollments (student_id, course_id, enrollment_date, status) VALUES (?, ?, NOW(), "active")',
      [studentId, courseId]
    );

    await connection.end();
    res.json({ success: true, message: 'Inscripción exitosa' });
  } catch (err) {
    console.error('Error en la inscripción:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para ver las inscripciones de un estudiante
app.get('/api/students/:id/enrollments', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [enrollments] = await connection.execute(
      `SELECT e.id, e.course_id, e.enrollment_date, e.status,
              c.name as course_name, c.description, c.image_url, c.duration, 
              c.price, c.course_type,
              t.name as teacher_name,
              t.specialty as teacher_specialty
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id 
       LEFT JOIN teachers t ON c.teacher_id = t.id 
       WHERE e.student_id = ? AND e.status = 'active'
       ORDER BY e.enrollment_date DESC`,
      [req.params.id]
    );
    
    // Formatear las fechas y datos para el frontend
    const formattedEnrollments = enrollments.map(enrollment => ({
      ...enrollment,
      enrollment_date: new Date(enrollment.enrollment_date).toLocaleDateString('es-ES'),
      duration: `${enrollment.duration} horas`,
      price: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(enrollment.price)
    }));

    await connection.end();
    res.json({ success: true, enrollments: formattedEnrollments });
  } catch (err) {
    console.error('Error al obtener inscripciones:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para actualizar perfil de estudiante
app.put('/api/students/:id', async (req, res) => {
  const { name, email, phone, document_type, document_number, country, password } = req.body;
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar si el email ya existe (excepto para el mismo usuario)
    if (email) {
      const [existing] = await connection.execute(
        'SELECT id FROM students WHERE email = ? AND id != ?',
        [email, id]
      );
      
      if (existing.length > 0) {
        await connection.end();
        return res.status(400).json({ 
          success: false, 
          message: 'El correo electrónico ya está registrado' 
        });
      }
    }

    // Construir query dinámicamente basado en los campos proporcionados
    const updates = [];
    const values = [];
    
    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (document_type) { updates.push('document_type = ?'); values.push(document_type); }
    if (document_number) { updates.push('document_number = ?'); values.push(document_number); }
    if (country) { updates.push('country = ?'); values.push(country); }
    if (password) { updates.push('password = ?'); values.push(password); }
    
    updates.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE students SET ${updates.join(', ')} WHERE id = ?`;
    await connection.execute(sql, values);
    
    // Obtener los datos actualizados
    const [updated] = await connection.execute(
      'SELECT id, name, email, phone, document_type, document_number, country, image_url FROM students WHERE id = ?',
      [id]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Perfil actualizado correctamente',
      user: updated[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para subir foto de perfil de estudiante
app.post('/api/students/profile-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se proporcionó ninguna imagen' 
    });
  }

  const userId = req.body.userId;
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtener la imagen anterior si existe
    const [oldImage] = await connection.execute(
      'SELECT image_url FROM students WHERE id = ?',
      [userId]
    );

    // Eliminar la imagen anterior si existe
    if (oldImage[0]?.image_url) {
      const oldPath = path.join(process.cwd(), oldImage[0].image_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Actualizar la URL de la imagen en la base de datos
    await connection.execute(
      'UPDATE students SET image_url = ?, updated_at = NOW() WHERE id = ?',
      [imageUrl, userId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Imagen de perfil actualizada',
      image_url: imageUrl
    });
  } catch (err) {
    // Eliminar la imagen subida si hay error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para subir imágenes de cursos
app.post('/api/courses/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se proporcionó ninguna imagen' 
    });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    res.json({ 
      success: true, 
      message: 'Imagen subida correctamente',
      image_url: imageUrl
    });
  } catch (err) {
    // Eliminar la imagen subida si hay error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para subir foto de perfil del profesor
app.post('/api/teachers/profile-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se proporcionó ninguna imagen' 
    });
  }

  const userId = req.body.userId;
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtener la imagen anterior si existe
    const [oldImage] = await connection.execute(
      'SELECT image_url FROM teachers WHERE id = ?',
      [userId]
    );

    // Eliminar la imagen anterior si existe
    if (oldImage[0]?.image_url) {
      const oldPath = path.join(process.cwd(), oldImage[0].image_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Actualizar la URL de la imagen en la base de datos
    await connection.execute(
      'UPDATE teachers SET image_url = ?, updated_at = NOW() WHERE id = ?',
      [imageUrl, userId]
    );

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Imagen de perfil actualizada',
      image_url: imageUrl
    });
  } catch (err) {
    // Eliminar la imagen subida si hay error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint para obtener los cursos de un profesor
app.get('/api/teachers/:id/courses', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [courses] = await connection.execute(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrolled_students 
       FROM courses c 
       WHERE c.teacher_id = ?`,
      [req.params.id]
    );
    await connection.end();
    res.json({ success: true, courses });
  } catch (err) {
    console.error('Error al obtener los cursos:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  const { 
    name, 
    description, 
    image_url, 
    course_type,
    duration,
    price,
    teacher_id
  } = req.body;

  if (!name || !description || !course_type || !duration || !teacher_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos obligatorios' 
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = `INSERT INTO courses (
      name, 
      description, 
      image_url, 
      course_type,
      duration,
      price,
      teacher_id,
      created_at,
      updated_at,
      active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`;

    const [result] = await connection.execute(sql, [
      name, 
      description, 
      image_url || null, 
      course_type,
      duration,
      price || 0,
      teacher_id
    ]);

    await connection.end();
    res.json({ 
      success: true, 
      message: 'Curso creado correctamente',
      courseId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`API Node.js escuchando en http://localhost:${port}`);
});
