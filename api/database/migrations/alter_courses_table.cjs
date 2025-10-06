const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

async function alterCoursesTable() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Agregar nuevos campos a la tabla courses
    await connection.execute(`
      ALTER TABLE courses
      ADD COLUMN objectives TEXT NULL AFTER price,
      ADD COLUMN requirements TEXT NULL AFTER objectives,
      ADD COLUMN start_date DATE NULL AFTER requirements,
      ADD COLUMN end_date DATE NULL AFTER start_date,
      ADD COLUMN schedule TEXT NULL AFTER end_date,
      ADD COLUMN max_students INT NULL AFTER schedule
    `);
    
    console.log('Tabla courses actualizada exitosamente');
    await connection.end();
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Los campos ya existen en la tabla');
    } else {
      console.error('Error al actualizar la tabla courses:', err);
    }
  }
}

alterCoursesTable();
