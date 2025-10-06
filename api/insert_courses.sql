USE weslogaj_db;

INSERT INTO courses (
    name,
    description,
    duration,
    price,
    teacher_id,
    active,
    course_type
) VALUES 
('Manejo Defensivo', 'Curso de manejo defensivo con videos instructivos sobre técnicas avanzadas de conducción segura', 40, 299.99, 1, 1, 'curso_corto'),
('Seguridad Vial', 'Aprende las mejores prácticas de seguridad vial a través de videos y ejemplos prácticos', 30, 199.99, 1, 1, 'curso_corto'),
('Primeros Auxilios', 'Curso básico de primeros auxilios con demostraciones en video', 20, 149.99, 1, 1, 'curso_corto');
