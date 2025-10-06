-- Agregar columna de imagen para estudiantes
ALTER TABLE students ADD COLUMN image_url VARCHAR(255) AFTER country;

-- Agregar columna de imagen para profesores
ALTER TABLE teachers ADD COLUMN image_url VARCHAR(255) AFTER country;

-- Agregar columnas para cursos
ALTER TABLE courses ADD COLUMN image_url VARCHAR(255) AFTER description;
ALTER TABLE courses ADD COLUMN course_type VARCHAR(50) AFTER description;
