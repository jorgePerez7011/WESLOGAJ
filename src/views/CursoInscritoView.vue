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
        <!-- Main content container -->
        <div class="flex flex-col xl:flex-row gap-6">
          <!-- Contenido principal -->
          <div class="flex-1">
            <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 flex flex-col lg:flex-row gap-6">
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

          <!-- Toggle del menú -->
          <button @click="showMenu = !showMenu" 
                  class="w-full flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors border-t border-b border-gray-200">
            <span class="mr-2 text-sm font-medium text-gray-600">{{ showMenu ? 'Ocultar menú' : 'Mostrar menú' }}</span>
            <svg class="w-5 h-5 text-gray-500 transform transition-transform" 
                 :class="showMenu ? 'rotate-180' : ''" 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Menú del curso -->
          <div v-show="showMenu" class="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-white border-b border-gray-200">
            <!-- Presentación -->
            <button @click="toggleSection('presentacion')"
                    class="flex flex-col items-center p-3 rounded-lg transition-colors"
                    :class="activeSection === 'presentacion' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'">
              <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium">Presentación</span>
            </button>

            <!-- Guía del curso -->
            <button @click="toggleSection('guia')"
                    class="flex flex-col items-center p-3 rounded-lg transition-colors"
                    :class="activeSection === 'guia' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'">
              <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-sm font-medium">Guía</span>
            </button>

            <!-- Quiz -->
            <button @click="toggleSection('evaluacion')"
                    class="flex flex-col items-center p-3 rounded-lg transition-colors"
                    :class="activeSection === 'evaluacion' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'">
              <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium">Quiz</span>
            </button>


          </div>
          

          
          <!-- Contenido dinámico según la sección seleccionada -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Sección de presentación -->
            <div v-if="activeSection === 'presentacion' && showContent" class="p-6 transition-all duration-300">
              <h2 class="text-xl font-bold mb-4">Presentación del Curso</h2>
              <div class="prose max-w-none text-gray-600">
                <p class="mb-4">{{ course.description }}</p>
                <h3 class="text-lg font-semibold mb-2">¿Qué aprenderás?</h3>
                <ul class="list-disc pl-5 mb-4">
                  <li>Dominarás los conceptos fundamentales de la materia</li>
                  <li>Desarrollarás habilidades prácticas aplicables</li>
                  <li>Obtendrás certificación al completar el curso</li>
                </ul>
                <h3 class="text-lg font-semibold mb-2">Requisitos previos</h3>
                <ul class="list-disc pl-5">
                  <li>No se requieren conocimientos previos</li>
                  <li>Acceso a un computador con conexión a internet</li>
                  <li>Disposición para aprender</li>
                </ul>
              </div>
            </div>

            <!-- Sección de guía -->
            <div v-if="activeSection === 'guia' && showContent" class="p-6 transition-all duration-300">
              <h2 class="text-xl font-bold mb-4">Guía del Curso</h2>
              <div class="prose max-w-none text-gray-600">
                <h3 class="text-lg font-semibold mb-2">Metodología</h3>
                <p class="mb-4">Este curso utiliza un enfoque práctico y dinámico que combina:</p>
                <ul class="list-disc pl-5 mb-6">
                  <li>Videos explicativos de cada tema</li>
                  <li>Material de lectura complementario</li>
                  <li>Ejercicios prácticos guiados</li>
                  <li>Foros de discusión y resolución de dudas</li>
                </ul>
                
                <h3 class="text-lg font-semibold mb-2">Estructura del curso</h3>
                <div class="space-y-4 mb-6">
                  <div class="flex items-center">
                    <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">1</span>
                    <span>Introducción a los conceptos básicos</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">2</span>
                    <span>Desarrollo de habilidades fundamentales</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">3</span>
                    <span>Aplicación práctica de conocimientos</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">4</span>
                    <span>Evaluación y certificación</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de evaluación (Quiz) -->
            <div v-if="activeSection === 'evaluacion' && showContent" class="p-6 transition-all duration-300">
              <h2 class="text-xl font-bold mb-4">Quiz del Curso</h2>
              <div class="prose max-w-none text-gray-600">
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <h3 class="text-blue-700 font-semibold mb-2">Información importante</h3>
                  <p class="text-blue-600">El quiz es obligatorio para completar el curso y obtener tu certificación.</p>
                </div>

                <h3 class="text-lg font-semibold mb-2">Detalles del Quiz</h3>
                <ul class="list-disc pl-5 mb-6">
                  <li>20 preguntas de opción múltiple</li>
                  <li>Tiempo límite: 45 minutos</li>
                  <li>Calificación mínima para aprobar: 70%</li>
                  <li>3 intentos disponibles</li>
                </ul>

                <h3 class="text-lg font-semibold mb-2">Recomendaciones</h3>
                <ul class="list-disc pl-5 mb-6">
                  <li>Revisa todo el material del curso antes de intentar el quiz</li>
                  <li>Asegúrate de tener una conexión estable a internet</li>
                  <li>Toma notas durante el curso para consultarlas</li>
                </ul>

                <div class="mt-6">
                  <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Comenzar Quiz
                  </button>
                </div>
              </div>
            </div>


          </div>

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

          

            
          </div>
        </div>
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
const activeSection = ref('presentacion')
const showMenu = ref(true) // El menú estará visible por defecto
const showContent = ref(true) // Controla la visibilidad del contenido de la sección activa

const toggleSection = (section) => {
  if (activeSection.value === section) {
    // Si hacemos clic en la sección activa, alternamos su visibilidad
    showContent.value = !showContent.value
  } else {
    // Si cambiamos a una nueva sección, la mostramos
    activeSection.value = section
    showContent.value = true
  }
}

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
