USE weslogaj_db;

ALTER TABLE courses 
ADD COLUMN course_type VARCHAR(50) NOT NULL DEFAULT 'curso_corto' 
AFTER description;
