const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db',
};

async function recreateTable() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Eliminar la tabla existente
    await connection.execute('DROP TABLE IF EXISTS courses');
    
    // Crear la tabla con la nueva estructura
    await connection.execute(`
      CREATE TABLE courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        course_type VARCHAR(50) NOT NULL DEFAULT 'curso_corto',
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
    
    console.log('Tabla courses recreada correctamente');
    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

recreateTable();
