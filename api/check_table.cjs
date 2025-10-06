const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weslogaj_db'
};

async function checkTable() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexión establecida');
        
        const [rows] = await connection.execute('DESCRIBE courses');
        console.log('Estructura actual de la tabla courses:');
        console.log(rows);
        
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkTable();
