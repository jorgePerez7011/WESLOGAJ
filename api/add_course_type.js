const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db',
};

async function addCourseType() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('ALTER TABLE courses ADD COLUMN course_type VARCHAR(50) NOT NULL DEFAULT "curso_corto" AFTER description');
    console.log('Columna course_type agregada correctamente');
    await connection.end();
  } catch (err) {
    console.error('Error al agregar la columna:', err.message);
  }
}

addCourseType();
