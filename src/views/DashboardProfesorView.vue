<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Botones de perfil y cerrar sesión -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Dashboard Profesor</h1>
        <div class="flex items-center space-x-4">
          <button 
            @click="() => { showProfileModal = true }" 
            class="flex items-center px-3 py-2 rounded-md hover:bg-gray-200 transition duration-150"
          >
            <img 
              :src="userInfo.image_url ? `http://localhost:3000${userInfo.image_url}` : '/default-avatar.png'" 
              :alt="userInfo.name"
              class="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
            <span class="ml-2 text-gray-700">{{ userInfo.name }}</span>
          </button>
          <button 
            @click="logout" 
            class="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium text-white transition duration-150"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      <!-- Welcome section -->
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Bienvenido, {{ userInfo.name }}
          </h2>
          <p class="text-gray-600">
            Gestiona tus cursos y estudiantes desde aquí.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6">
        <button 
          @click="showNewCourseModal = true" 
          class="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition duration-150"
        >
          Crear Nuevo Curso
        </button>
      </div>

      <!-- Modal de Crear Curso -->
      <CrearCursoModal
        v-if="showNewCourseModal"
        @close="showNewCourseModal = false"
        @course-created="handleCourseCreated"
      />

      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in courses" :key="course.id" class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ course.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              {{ course.description }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-blue-600">
                {{ course.enrolled_students }} estudiantes
              </span>
              <button 
                @click="() => router.push(`/curso/${course.id}/gestionar`)"
                class="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800"
              >
                Gestionar Curso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 z-50">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
          <!-- Close button -->
          <div class="absolute top-0 right-0 p-4">
            <button 
              @click="showProfileModal = false"
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span class="sr-only">Cerrar</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Profile Content -->
          <div class="p-6 overflow-y-auto max-h-[80vh]">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Mi Perfil</h2>
            <PerfilProfesor @profile-updated="handleProfileUpdate" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PerfilProfesor from './PerfilProfesorView.vue'
import CrearCursoModal from '../components/CrearCursoModal.vue'

interface Course {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  duration: number;
  price: number;
  teacher_id: number;
  enrolled_students: number;
  created_at: string;
  updated_at: string;
  active: boolean;
}

const router = useRouter()
const userInfo = ref({
  name: '',
  email: '',
  id: null,
  specialty: '',
  image_url: ''
})
const courses = ref<Course[]>([])
const showNewCourseModal = ref(false)
const showProfileModal = ref(false)
const handleCourseCreated = async () => {
  // Recargar la lista de cursos
  try {
    const response = await fetch(`http://localhost:3000/api/teachers/${userInfo.value.id}/courses`)
    const data = await response.json()
    if (data.success) {
      courses.value = data.courses
    }
  } catch (error) {
    console.error('Error al recargar los cursos:', error)
  }
}

// Función para actualizar la información del perfil
const handleProfileUpdate = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    userInfo.value = JSON.parse(storedUser)
  }
}

onMounted(async () => {
  // Recuperar información del usuario del localStorage
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    router.push('/login/profesor')
    return
  }

  userInfo.value = JSON.parse(storedUser)

  // Cargar los cursos del profesor
  try {
    const response = await fetch(`http://localhost:3000/api/teachers/${userInfo.value.id}/courses`)
    const data = await response.json()
    if (data.success) {
      courses.value = data.courses
    }
  } catch (error) {
    console.error('Error al cargar los cursos:', error)
  }
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login/profesor')
}
</script>
