const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weslogaj_db'
};

async function addColumn() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión establecida');
        
        // Agregar la columna course_type si no existe
        await connection.execute(`
            ALTER TABLE courses 
            ADD COLUMN IF NOT EXISTS course_type VARCHAR(50) NOT NULL DEFAULT 'curso_corto' 
            AFTER description
        `);
        
        console.log('Columna course_type agregada correctamente');
        
        // Verificar la estructura actualizada
        const [rows] = await connection.execute('DESCRIBE courses');
        console.log('Estructura actualizada de la tabla courses:');
        console.log(rows);
        
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

addColumn();
