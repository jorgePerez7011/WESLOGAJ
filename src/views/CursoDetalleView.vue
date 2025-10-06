`<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Curso detalle -->
      <div v-if="curso" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- Imagen del curso -->
        <div class="relative h-96">
          <img 
            :src="curso.image_url ? `http://localhost:3000${curso.image_url}` : '/default-course.jpg'" 
            :alt="curso.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 class="text-4xl font-bold text-white text-center px-4">{{ curso.name }}</h1>
          </div>
        </div>

        <div class="p-8">
          <!-- Tipo de curso y precio -->
          <div class="flex justify-between items-start mb-6">
            <span class="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-semibold">
              {{ {
                'curso_corto': 'Curso Corto',
                'curso_largo': 'Curso Largo',
                'diplomado': 'Diplomado',
                'tecnico': 'Técnico Laboral'
              }[curso.course_type] || curso.course_type }}
            </span>
            <div class="text-right">
              <p class="text-2xl font-bold text-blue-900">
                {{ new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(curso.price) }}
              </p>
            </div>
          </div>

          <!-- Información del profesor -->
          <div class="flex items-center mb-6">
            <img 
              :src="curso.teacher_image ? `http://localhost:3000${curso.teacher_image}` : '/default-avatar.png'"
              class="w-12 h-12 rounded-full object-cover mr-4"
              :alt="curso.teacher_name"
            />
            <div>
              <h3 class="text-lg font-semibold">{{ curso.teacher_name }}</h3>
              <p class="text-gray-600">{{ curso.teacher_specialty }}</p>
            </div>
          </div>

          <!-- Detalles del curso -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-blue-900 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ curso.duration }} horas</span>
            </div>
            <div class="flex items-center">
              <svg class="h-6 w-6 text-blue-900 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{{ curso.enrolled_students }} estudiantes inscritos</span>
            </div>
            <div class="flex items-center">
              <svg class="h-6 w-6 text-blue-900 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Certificación al completar</span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="prose max-w-none mb-8">
            <h2 class="text-2xl font-bold mb-4">Descripción del curso</h2>
            <p class="text-gray-600">{{ curso.description }}</p>
          </div>

          <!-- Módulos del curso -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-6">Contenido del curso</h2>
            
            <div v-if="curso.modules && curso.modules.length > 0">
              <div v-for="(module, index) in curso.modules" :key="module.id" class="mb-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                  <h3 class="text-xl font-semibold mb-3">
                    Módulo {{ index + 1 }}: {{ module.title }}
                  </h3>
                  <p class="text-gray-600 mb-4">{{ module.description }}</p>
                  
                  <!-- Recursos -->
                  <div class="space-y-4">
                    <!-- Documentos -->
                    <div v-if="module.resources.documents.length > 0">
                      <h4 class="font-medium text-blue-900 mb-2">Documentos</h4>
                      <ul class="list-disc list-inside space-y-2">
                        <li v-for="doc in module.resources.documents" :key="doc.id">
                          <a 
                            :href="doc.file_path"
                            class="text-blue-600 hover:underline flex items-center"
                            target="_blank"
                          >
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {{ doc.name }}
                          </a>
                        </li>
                      </ul>
                    </div>

                    <!-- Videos -->
                    <div v-if="module.resources.videos.length > 0">
                      <h4 class="font-medium text-blue-900 mb-2">Videos</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="video in module.resources.videos" :key="video.id" class="aspect-w-16 aspect-h-9">
                          <template v-if="video.type === 'video-url'">
                            <iframe
                              :src="video.url"
                              class="w-full h-full rounded"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen
                            ></iframe>
                          </template>
                          <template v-else>
                            <video
                              :src="video.file_path"
                              class="w-full h-full rounded"
                              controls
                            ></video>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- Enlaces -->
                    <div v-if="module.resources.links.length > 0">
                      <h4 class="font-medium text-blue-900 mb-2">Enlaces</h4>
                      <ul class="space-y-2">
                        <li v-for="link in module.resources.links" :key="link.id">
                          <a 
                            :href="link.url"
                            class="text-blue-600 hover:underline flex items-center"
                            target="_blank"
                          >
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {{ link.description || link.url }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-8">
              El contenido del curso aún no está disponible
            </div>
          </div>

          <!-- Botón de inscripción -->
          <div class="flex justify-end">
            <div v-if="userRole === 'student'">
              <button 
                v-if="!isEnrolled"
                @click="inscribirse" 
                :disabled="loading"
                class="bg-blue-900 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-800 transition-colors duration-200"
              >
                {{ loading ? 'Procesando...' : 'Inscribirme al curso' }}
              </button>
              <p v-else class="text-green-600 font-medium">Ya estás inscrito en este curso</p>
            </div>
            <p v-else-if="!userRole" class="text-blue-900">
              <a href="/login/estudiante" class="underline">Inicia sesión</a> como estudiante para inscribirte
            </p>
          </div>

          <!-- Mensaje de error/éxito -->
          <div v-if="message" :class="{'text-green-600': !error, 'text-red-600': error}" class="mt-4 text-center">
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
      </div>

      <!-- Error state -->
      <div v-else class="text-center py-12">
        <p class="text-red-600">No se pudo cargar la información del curso</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Resource {
  id: number;
  type: 'document' | 'video-url' | 'video-file' | 'link';
  name?: string;
  description?: string;
  url?: string;
  file_path?: string;
}

interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  resources: {
    documents: Resource[];
    videos: Resource[];
    links: Resource[];
  };
}

interface Curso {
  id: number;
  name: string;
  description: string;
  course_type: 'curso_corto' | 'curso_largo' | 'diplomado' | 'tecnico';
  image_url?: string;
  duration: number;
  price: number;
  teacher_id: number;
  teacher_name: string;
  teacher_specialty: string;
  teacher_image?: string;
  enrolled_students: number;
  modules?: Module[];
  created_at: string;
  updated_at: string;
}

const route = useRoute()
const router = useRouter()
const curso = ref<Curso | null>(null)
const loading = ref(false)
const message = ref('')
const error = ref(false)
const isEnrolled = ref(false)
const userRole = ref<string | null>(null)

onMounted(async () => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    userRole.value = userData.role
    await checkEnrollment(userData.id)
  }

  await loadCurso()
})

const loadCurso = async () => {
  loading.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${route.params.id}`)
    const data = await response.json()
    if (data.success) {
      curso.value = data.course
    } else {
      error.value = true
      message.value = data.message || 'Error al cargar el curso'
    }
  } catch (e) {
    error.value = true
    message.value = 'Error al cargar el curso'
  } finally {
    loading.value = false
  }
}

const checkEnrollment = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/api/students/${userId}/enrollments`)
    const data = await response.json()
    if (data.success) {
      isEnrolled.value = data.enrollments.some(
        (enrollment: any) => enrollment.course_id === Number(route.params.id)
      )
    }
  } catch (e) {
    console.error('Error al verificar inscripción:', e)
  }
}

const inscribirse = async () => {
  const user = localStorage.getItem('user')
  if (!user) {
    router.push('/login/estudiante')
    return
  }

  const userData = JSON.parse(user)
  loading.value = true
  message.value = ''
  error.value = false

  try {
    const response = await fetch('http://localhost:3000/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id: userData.id,
        course_id: curso.value?.id
      })
    })

    const data = await response.json()
    if (data.success) {
      message.value = 'Te has inscrito exitosamente al curso'
      error.value = false
      isEnrolled.value = true
      
      // Recargar el curso para actualizar el número de estudiantes
      await loadCurso()
    } else {
      message.value = data.message || 'Error al inscribirse al curso'
      error.value = true
    }
  } catch (e) {
    message.value = 'Error al inscribirse al curso'
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
`
