const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weslogaj_db'
};

async function createModulesTables() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión establecida');

        // Crear tabla de módulos
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS course_modules (
                id INT PRIMARY KEY AUTO_INCREMENT,
                course_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                order_index INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )
        `);
        console.log('Tabla de módulos creada');

        // Crear tabla de contenido de módulos
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS module_content (
                id INT PRIMARY KEY AUTO_INCREMENT,
                module_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content_type ENUM('video_local', 'video_link', 'pdf', 'doc', 'xlsx') NOT NULL,
                content_url VARCHAR(1000) NOT NULL,
                description TEXT,
                order_index INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (module_id) REFERENCES course_modules(id)
            )
        `);
        console.log('Tabla de contenido creada');

        await connection.end();
        console.log('Proceso completado exitosamente');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

createModulesTables();
