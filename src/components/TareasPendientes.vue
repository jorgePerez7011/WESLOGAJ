<template>
  <div class="tareas-pendientes">
    <div class="header">
      <h2 class="title">Tareas Pendientes</h2>
    </div>
    
    <div v-if="loading" class="loading">
      <span>Cargando tareas...</span>
    </div>

    <div v-else-if="cursos.length === 0" class="no-courses">
      <p>No estás inscrito en ningún curso actualmente.</p>
    </div>

    <div v-else class="courses-list">
      <div v-for="curso in cursos" :key="curso.id" class="course-section">
        <h3 class="course-title">{{ curso.course_name }}</h3>
        <div class="task-list">
          <div v-for="modulo in curso.modulos" :key="modulo.id" class="module-item">
            <div class="module-header">
              <span class="module-name">{{ modulo.title }}</span>
              <span class="progress-badge" :class="modulo.status">
                {{ modulo.status === 'completed' ? 'Completado' : 'Pendiente' }}
              </span>
            </div>
            <div class="module-resources">
              <div v-for="resource in modulo.resources" :key="resource.id" 
                   class="resource-item" :class="{ 'completed': resource.completed }">
                <i class="resource-icon" :class="getResourceIcon(resource.type)"></i>
                <span class="resource-name">{{ resource.name }}</span>
                <span class="resource-status">
                  {{ resource.completed ? '✓' : '!' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const cursos = ref([]);
const loading = ref(true);

function getResourceIcon(type) {
  const icons = {
    'video': 'fas fa-video',
    'document': 'fas fa-file-alt',
    'quiz': 'fas fa-question-circle',
    'task': 'fas fa-tasks'
  };
  return icons[type] || 'fas fa-file';
}

onMounted(async () => {
  try {
    // Obtener el ID del estudiante del localStorage
    const studentId = localStorage.getItem('studentId');
    
    // Obtener los cursos inscritos con sus módulos
    const response = await fetch(`http://localhost:3000/api/students/${studentId}/enrolled-courses-modules`);
    const data = await response.json();
    
    if (data.success) {
      cursos.value = data.courses;
    }
  } catch (error) {
    console.error('Error al cargar las tareas pendientes:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.tareas-pendientes {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  width: 300px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.course-section {
  margin-bottom: 24px;
}

.course-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 12px;
}

.module-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.module-name {
  font-weight: 500;
  color: #4a5568;
}

.progress-badge {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.progress-badge.completed {
  background: #c6f6d5;
  color: #2f855a;
}

.progress-badge.pending {
  background: #fed7d7;
  color: #c53030;
}

.module-resources {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.resource-item.completed {
  color: #718096;
}

.resource-icon {
  width: 16px;
  color: #4a5568;
}

.resource-name {
  flex: 1;
}

.resource-status {
  font-weight: bold;
}

.completed .resource-status {
  color: #48bb78;
}

.loading, .no-courses {
  text-align: center;
  color: #718096;
  padding: 20px;
}
</style>