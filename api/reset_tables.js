const mysql = require("mysql2/promise");

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "weslogaj_db"
};

async function resetTables() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conexión establecida");

        await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
        console.log("Restricciones de clave foránea desactivadas");

        await connection.execute("DROP TABLE IF EXISTS enrollments");
        console.log("Tabla enrollments eliminada");

        await connection.execute("DROP TABLE IF EXISTS courses");
        console.log("Tabla courses eliminada");

        await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
        console.log("Restricciones de clave foránea reactivadas");

        await connection.execute(`
            CREATE TABLE courses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                course_type VARCHAR(50) NOT NULL DEFAULT "curso_corto",
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
        console.log("Tabla courses creada");

        await connection.execute(`
            CREATE TABLE enrollments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                student_id INT NOT NULL,
                course_id INT NOT NULL,
                enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT "active",
                FOREIGN KEY (student_id) REFERENCES students(id),
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )
        `);
        console.log("Tabla enrollments creada");

        await connection.end();
        console.log("Proceso completado exitosamente");
    } catch (err) {
        console.error("Error:", err.message);
    }
}

resetTables();
