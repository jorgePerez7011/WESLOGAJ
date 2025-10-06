const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

async function insertTestData() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Insertar estudiantes de prueba si no existen
    const students = [
      ['Juan Pérez', 'juan@example.com', 'password123', '1234567', 'CC', '123456789', 'Colombia'],
      ['María García', 'maria@example.com', 'password123', '7654321', 'CC', '987654321', 'Colombia'],
      ['Pedro López', 'pedro@example.com', 'password123', '9876543', 'CC', '456789123', 'Colombia']
    ];

    for (const student of students) {
      await connection.execute(`
        INSERT INTO students (name, email, password, phone, document_type, document_number, country, created_at, updated_at, active)
        SELECT ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1
        WHERE NOT EXISTS (
          SELECT 1 FROM students WHERE email = ?
        )
      `, [...student, student[1]]);
    }

    // Obtener IDs de los estudiantes
    const [studentRows] = await connection.execute('SELECT id FROM students WHERE email IN (?, ?, ?)', 
      ['juan@example.com', 'maria@example.com', 'pedro@example.com']);

    // Insertar inscripciones de prueba para cada estudiante
    for (const student of studentRows) {
      await connection.execute(`
        INSERT INTO enrollments (student_id, course_id, enrollment_date, status)
        SELECT ?, 1, DATE_SUB(NOW(), INTERVAL RAND() * 30 DAY), 'active'
        WHERE NOT EXISTS (
          SELECT 1 FROM enrollments WHERE student_id = ? AND course_id = 1
        )
      `, [student.id, student.id]);
    }

    // Insertar módulos de prueba para el curso con ID 1
    const modules = [
      ['Introducción al Curso', 'Fundamentos y conceptos básicos del curso'],
      ['Técnicas Avanzadas', 'Métodos y técnicas especializadas'],
      ['Práctica y Evaluación', 'Ejercicios prácticos y evaluación final']
    ];

    for (const [title, description] of modules) {
      await connection.execute(`
        INSERT INTO modules (course_id, title, description)
        VALUES (1, ?, ?)
      `, [title, description]);

      // Obtener el ID del módulo recién insertado
      const [moduleResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
      const moduleId = moduleResult[0].id;

      // Insertar recursos de prueba para cada módulo
      const resources = [
        ['document', 'Material de lectura', null, 'Documento PDF con el contenido del módulo'],
        ['video-url', 'Video introductorio', 'https://example.com/video1', 'Video explicativo del módulo'],
        ['link', 'Recursos adicionales', 'https://example.com/resources', 'Enlaces a recursos complementarios']
      ];

      for (const [type, title, url, description] of resources) {
        await connection.execute(`
          INSERT INTO resources (module_id, type, title, url, description)
          VALUES (?, ?, ?, ?, ?)
        `, [moduleId, type, title, url, description]);
      }
    }

    console.log('Datos de prueba insertados correctamente');
    await connection.end();

  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
  }
}

insertTestData().then(() => {
  console.log('Script completado');
  process.exit(0);
}).catch(error => {
  console.error('Error en el script:', error);
  process.exit(1);
});
