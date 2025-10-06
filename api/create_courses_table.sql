CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    course_type VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    duration INT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    teacher_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
