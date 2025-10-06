`<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-xl font-bold mb-4">Actualizaciones Recientes</h2>
    
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
    
    <div v-else-if="error" class="text-red-600 text-center py-4">
      {{ error }}
    </div>
    
    <div v-else-if="updates.length === 0" class="text-gray-500 text-center py-4">
      No hay actualizaciones recientes en tus cursos.
    </div>
    
    <div v-else class="space-y-6">
      <div v-for="course in updates" :key="course.courseId" class="border-b pb-4 last:border-b-0">
        <h3 class="font-semibold text-lg text-blue-600 mb-2">{{ course.courseName }}</h3>
        
        <div v-for="module in course.modules" :key="module.moduleId" class="ml-4 mb-4">
          <div class="flex items-start">
            <div class="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></div>
            <div class="flex-1">
              <h4 class="font-medium">{{ module.moduleTitle }}</h4>
              <p class="text-sm text-gray-600 mb-2">{{ module.moduleDescription }}</p>
              
              <!-- Recursos -->
              <div v-if="module.resources.length > 0" class="ml-4 space-y-2">
                <div v-for="resource in module.resources" :key="resource.id" 
                     class="flex items-center text-sm">
                  <!-- Icono según el tipo de recurso -->
                  <span v-if="resource.type === 'document'" class="mr-2">
                    📄
                  </span>
                  <span v-else-if="resource.type === 'video-file' || resource.type === 'video-url'" class="mr-2">
                    🎥
                  </span>
                  <span v-else-if="resource.type === 'link'" class="mr-2">
                    🔗
                  </span>
                  
                  <!-- Título y enlace del recurso -->
                  <a v-if="resource.url || resource.filePath" 
                     :href="resource.url || resource.filePath"
                     target="_blank"
                     class="text-blue-500 hover:text-blue-600">
                    {{ resource.title }}
                  </a>
                  <span v-else>{{ resource.title }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-xs text-gray-500 mt-1 ml-4">
            Actualizado {{ formatDate(module.updatedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  studentId: {
    type: Number,
    required: true
  }
})

const updates = ref([])
const loading = ref(true)
const error = ref(null)

const loadUpdates = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(`http://localhost:3000/api/students/${props.studentId}/updates`)
    if (!response.ok) throw new Error('Error al cargar las actualizaciones')
    
    const data = await response.json()
    if (data.success) {
      updates.value = data.updates
    } else {
      throw new Error(data.message || 'Error al cargar las actualizaciones')
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  const dateObj = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - dateObj)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'hoy'
  } else if (diffDays === 1) {
    return 'ayer'
  } else if (diffDays < 7) {
    return `hace ${diffDays} días`
  } else {
    return dateObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
}

onMounted(() => {
  loadUpdates()
})
</script>`
