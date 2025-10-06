import express from 'express';
import mysql from 'mysql2/promise';
import { dbConfig } from '../db.php';

const router = express.Router();

router.get('/students/:studentId/enrolled-courses-modules', async (req, res) => {
    const { studentId } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Obtener los cursos en los que está inscrito el estudiante
        const [enrolledCourses] = await connection.execute(`
            SELECT c.id, c.course_name, c.description, c.image_url
            FROM courses c
            INNER JOIN enrollments e ON c.id = e.course_id
            WHERE e.student_id = ? AND e.status = 'active'
        `, [studentId]);

        // Para cada curso, obtener sus módulos y recursos
        const coursesWithModules = await Promise.all(enrolledCourses.map(async (course) => {
            // Obtener módulos del curso
            const [modules] = await connection.execute(`
                SELECT m.id, m.title, m.description,
                    CASE 
                        WHEN mr.completion_status = 'completed' THEN 'completed'
                        ELSE 'pending'
                    END as status
                FROM modules m
                LEFT JOIN module_resources mr ON m.id = mr.module_id
                WHERE m.course_id = ?
                GROUP BY m.id
            `, [course.id]);

            // Para cada módulo, obtener sus recursos
            const modulesWithResources = await Promise.all(modules.map(async (module) => {
                const [resources] = await connection.execute(`
                    SELECT r.id, r.name, r.type, 
                           CASE WHEN mr.completion_status = 'completed' 
                           THEN true ELSE false END as completed
                    FROM module_resources r
                    LEFT JOIN module_resource_progress mr 
                        ON r.id = mr.resource_id AND mr.student_id = ?
                    WHERE r.module_id = ?
                `, [studentId, module.id]);

                return {
                    ...module,
                    resources
                };
            }));

            return {
                ...course,
                modulos: modulesWithResources
            };
        }));

        res.json({
            success: true,
            courses: coursesWithModules
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los módulos y tareas pendientes'
        });
    } finally {
        await connection.end();
    }
});

export default router;