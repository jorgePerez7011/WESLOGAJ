$query = @"
USE weslogaj_db;

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
);
"@

# Guardar la consulta en un archivo temporal
$query | Out-File -Encoding UTF8 "create_forum_table.sql"

# Ejecutar el comando mysql
& 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe' -u root weslogaj_db -e $query

# Eliminar el archivo temporal
Remove-Item "create_forum_table.sql"
