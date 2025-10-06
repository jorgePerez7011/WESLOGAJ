import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'weslogaj_db'
};

async function createForumTable() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Creando tabla forum_posts...');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        user_id INT NOT NULL,
        user_type ENUM('student', 'teacher') NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        INDEX idx_course_posts (course_id, created_at DESC)
      )
    `);
    
    console.log('Tabla forum_posts creada exitosamente');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error al crear la tabla:', error);
    process.exit(1);
  }
}

createForumTable();
