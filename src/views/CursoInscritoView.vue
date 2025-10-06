<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Estado de carga -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-else class="space-y-6">
        <!-- Sección de video (lado izquierdo) -->
        <!-- Main content container -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Video section -->
          <div v-if="selectedVideo" class="lg:w-2/3">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <div class="aspect-w-16 aspect-h-9">
                <video
                  v-if="selectedVideo.type === 'video-file'"
                  class="w-full h-full object-cover"
                  controls
                  :src="getResourceUrl(selectedVideo)"
                ></video>
                <iframe
                  v-else-if="selectedVideo.type === 'video-url'"
                  class="w-full h-full"
                  :src="selectedVideo.url"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <div class="p-4">
                <h3 class="text-lg font-semibold">{{ selectedVideo.title }}</h3>
                <p v-if="selectedVideo.description" class="text-gray-600 mt-2">
                  {{ selectedVideo.description }}
                </p>
              </div>
            </div>
          </div>

        <!-- Contenido del curso (lado derecho) -->
        <div class="lg:flex-1">
          <!-- Encabezado del curso -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div class="relative h-48">
              <img 
                :src="course.image_url ? `http://localhost:3000${course.image_url}` : '/default-course.jpg'" 
                :alt="course.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center p-6">
                <div class="text-white">
                  <h1 class="text-3xl font-bold mb-2">{{ course.name }}</h1>
                  <div class="flex items-center">
                    <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      {{ course.course_type }}
                    </span>
                    <span class="ml-4 flex items-center">
                      <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ course.duration }} horas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Información del estudiante -->
            <div v-if="currentUser && currentUser.role === 'student'" class="mb-4">
              <div class="flex items-center">
                <img 
                  :src="currentUser.profile_image ? `http://localhost:3000${currentUser.profile_image}` : '/vite.svg'"
                  :alt="currentUser.name"
                  class="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 class="text-lg font-semibold">{{ currentUser.name }}</h3>
                  <p class="text-gray-600">Estudiante inscrito</p>
                </div>
              </div>
            </div>
            
            <!-- Contenido del curso -->
            <div class="mt-4">
              <h2 class="text-xl font-bold mb-2">Descripción del curso</h2>
              <p class="text-gray-700">{{ course.description }}</p>
              
              <div class="mt-4 flex flex-wrap gap-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ course.duration }} horas
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  $ {{ course.price.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Contenido del curso organizado en secciones -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden divide-y divide-gray-200">
            <!-- Sección de descripción -->
          <AccordionSection>
            <template #icon>
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <template #title>Descripción del curso</template>
            <div class="mt-4 text-gray-600">
              <p>{{ course.description }}</p>
              <div class="mt-4 flex flex-wrap gap-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ course.duration }} horas
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  $ {{ course.price?.toLocaleString() }}
                </span>
              </div>
            </div>
          </AccordionSection>

          <!-- Sección de módulos -->
          <div>
            <div v-if="course.modules && course.modules.length > 0">
              <div v-for="(module, index) in course.modules" :key="module.id">
                <AccordionSection :subtitle="formatModuleProgress(module)">
                  <template #icon>
                    <span class="text-white text-sm">{{ index + 1 }}</span>
                  </template>
                  <template #title>{{ module.title }}</template>
                  <div class="mt-4">
                    <p class="text-gray-600 mb-4">{{ module.description }}</p>
                      
                    <!-- Recursos del módulo -->
                    <div v-if="module.resources && module.resources.length > 0" 
                         class="space-y-3 ml-4">
                      <div v-for="resource in module.resources" :key="resource.id"
                           class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <!-- Icono según el tipo de recurso -->
                        <div class="mr-3">
                          <span v-if="resource.type === 'document'" class="text-blue-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </span>
                          <span v-else-if="resource.type === 'video-file' || resource.type === 'video-url'" class="text-red-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                          <span v-else-if="resource.type === 'link'" class="text-green-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </span>
                        </div>
                        
                        <!-- Título y enlace del recurso -->
                        <div class="flex-1">
                          <h4 class="font-medium">{{ resource.title }}</h4>
                          <p v-if="resource.description" class="text-sm text-gray-600">
                            {{ resource.description }}
                          </p>
                        </div>
                        
                        <!-- Botón de acceso -->
                        <button v-if="resource.type === 'video-url' || resource.type === 'video-file'"
                                @click="selectedVideo = resource"
                                class="ml-4 text-blue-600 hover:text-blue-800">
                          <span class="sr-only">Ver video</span>
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <a v-else-if="resource.type === 'link'" 
                           :href="resource.url"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="ml-4 text-blue-600 hover:text-blue-800">
                          <span class="sr-only">Abrir enlace</span>
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        
                        <!-- Botón de descarga para archivos -->
                        <div v-else-if="resource.type === 'document' || resource.type === 'video-file'" 
                             class="flex items-center">
                          <!-- URL de depuración -->
                          <span class="text-sm text-gray-500 mr-2">
                            {{ resource.file_path }}
                          </span>
                          
                          <button @click="downloadResource(resource)"
                                  class="ml-4 text-blue-600 hover:text-blue-800 flex items-center">
                            <span class="sr-only">Descargar archivo</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionSection>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              No hay módulos disponibles en este curso todavía.
            </div>
          </div>
        </div>

          <!-- Foro del curso -->
          <div class="mt-8">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
              <CourseForum
                :courseId="route.params.id"
                :currentUser="currentUser"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CourseForum from '../components/CourseForum.vue'
import UserAvatar from '../components/UserAvatar.vue'
import AccordionSection from '../components/AccordionSection.vue'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const loading = ref(true)
const error = ref(null)
const userStorage = localStorage.getItem('user')
const currentUser = ref(userStorage ? JSON.parse(userStorage) : null)
const selectedVideo = ref(null)

// Initialize user role if not present
if (currentUser.value && !currentUser.value.role) {
  currentUser.value.role = route.path.includes('/estudiante/') ? 'student' : 'teacher'
}

const formatModuleProgress = (module) => {
  // This is a placeholder function - implement actual progress tracking logic
  return 'En progreso'
}

const getResourceUrl = (resource) => {
  if (!resource.file_path) return ''
  return `http://localhost:3000${resource.file_path}`
}

const downloadResource = async (resource) => {
  try {
    const response = await fetch(`http://localhost:3000${resource.file_path}`)
    
    if (!response.ok) {
      throw new Error(`Error al descargar: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = resource.title || resource.file_path.split('/').pop()
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    console.error('Error al descargar el archivo:', err)
    alert('Error al descargar el archivo. Por favor, intente nuevamente.')
  }
}

const loadCourse = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(`http://localhost:3000/api/courses/${route.params.id}`)
    if (!response.ok) throw new Error('Error al cargar el curso')
    
    const data = await response.json()
    if (data.success) {
      course.value = data.course
    } else {
      throw new Error(data.message || 'Error al cargar el curso')
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!route.params.id) {
    router.push('/dashboard/estudiante')
    return
  }
  loadCourse()
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>`
