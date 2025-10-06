const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

async function createModuleTables() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Crear tabla modules
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Crear tabla resources
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module_id INT NOT NULL,
        type ENUM('document', 'video-url', 'video-file', 'link') NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(512),
        description TEXT,
        file_path VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      )
    `);

    console.log('Tablas de módulos creadas correctamente');
    await connection.end();

  } catch (err) {
    console.error('Error al crear las tablas de módulos:', err);
  }
}

createModuleTables();
