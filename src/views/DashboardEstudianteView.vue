<template>
  <div class="min-h-screen bg-gray-100">
    <FloatingAnnouncements v-if="welcomeAnnouncements.length > 0" :initial-announcements="welcomeAnnouncements" />
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <!-- Botones de perfil y cerrar sesión -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Dashboard Estudiante</h1>
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
            Aquí podrás gestionar tus cursos y ver tu progreso académico.
          </p>
          
          <!-- Mensaje de inscripción exitosa -->
          <div v-if="showSuccessMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p>¡Te has inscrito exitosamente al curso de {{ inscribedCourse }}!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actualizaciones Recientes -->
      <div class="mb-6">
        <ActualizacionesRecientes :studentId="userInfo.id" />
      </div>

      <!-- Courses Section -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800">Mis Cursos</h2>
        
        <!-- Message when no courses -->
        <div v-if="enrollments.length === 0" class="bg-white p-6 rounded-lg shadow text-center">
          <p class="text-gray-600">No estás inscrito en ningún curso todavía.</p>
          <button 
            @click="router.push('/cursos')" 
            class="mt-4 bg-blue-900 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-800"
          >
            Explorar Cursos
          </button>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="enrollment in enrollments" 
            :key="enrollment.id" 
            class="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <!-- Course Image -->
            <div class="aspect-w-16 aspect-h-9">
              <img 
                :src="enrollment.image_url ? `http://localhost:3000${enrollment.image_url}` : '/default-course.jpg'" 
                :alt="enrollment.course_name"
                class="w-full h-48 object-cover"
              />
            </div>

            <div class="p-6">
              <!-- Course Type Badge -->
              <span class="inline-block px-3 py-1 text-xs font-semibold text-blue-900 bg-blue-100 rounded-full mb-2">
                {{ {
                  'curso_corto': 'Curso Corto',
                  'curso_largo': 'Curso Largo',
                  'diplomado': 'Diplomado',
                  'tecnico': 'Técnico Laboral'
                }[enrollment.course_type] || enrollment.course_type }}
              </span>

              <!-- Course Title -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ enrollment.course_name }}
              </h3>

              <!-- Course Description -->
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ enrollment.description }}
              </p>

              <!-- Course Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ enrollment.teacher_name }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ enrollment.duration }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Inscrito el {{ enrollment.enrollment_date }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-blue-900">
                  {{ enrollment.price }}
                </span>
                <router-link 
                  :to="{ name: 'ver-curso', params: { id: enrollment.course_id }}"
                  class="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors duration-200 inline-block"
                >
                  Ir al Curso
                </router-link>
              </div>
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
            <PerfilEstudiante @profile-updated="handleProfileUpdate" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PerfilEstudiante from './PerfilEstudianteView.vue'
import ActualizacionesRecientes from '../components/ActualizacionesRecientes.vue'
import FloatingAnnouncements from '../components/FloatingAnnouncements.vue'

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  document_type: string;
  document_number: string;
  country: string;
  image_url?: string;
}

interface Enrollment {
  id: number;
  course_id: number;
  course_name: string;
  description: string;
  image_url?: string;
  duration: string;
  price: number;
  teacher_name: string;
  enrollment_date: string;
  status: string;
  course_type: 'curso_corto' | 'curso_largo' | 'diplomado' | 'tecnico';
  teacher_specialty: string;
}

const router = useRouter()
const route = useRoute()
const userInfo = ref<UserInfo>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  document_type: '',
  document_number: '',
  country: ''
})
const enrollments = ref<Enrollment[]>([])
const showProfileModal = ref(false)
const showSuccessMessage = ref(false)
const inscribedCourse = ref('')
const welcomeAnnouncements = ref<Array<{id: number; title: string; message: string}>>([]);


// Verificar si viene de una inscripción exitosa
if (route.query.inscripcionExitosa === 'true' && route.query.curso) {
  showSuccessMessage.value = true
  inscribedCourse.value = route.query.curso as string
  // Ocultar el mensaje después de 5 segundos
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 5000)
}

// Función para actualizar la información del perfil
const handleProfileUpdate = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    userInfo.value = JSON.parse(storedUser)
  }
}

// Manejar la tecla Escape para cerrar el modal
onMounted(() => {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showProfileModal.value) {
      showProfileModal.value = false
    }
  })
})

const generateWelcomeAnnouncements = (user: UserInfo, enrollmentsData: Enrollment[]) => {
  let nextId = 1;
  const announcements = [];
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? '¡Buenos días' : currentHour < 19 ? '¡Buenas tardes' : '¡Buenas noches';
  
  // Anuncio de bienvenida personalizado según la hora
  announcements.push({
    id: nextId++,
    title: `${greeting}, ${user.name}!`,
    message: 'Esperamos que estés listo para seguir aprendiendo hoy.'
  });

  // Anuncio sobre cursos pendientes
  const pendingCourses = enrollmentsData.filter(e => e.status === 'pendiente').length;
  if (pendingCourses > 0) {
    announcements.push({
      id: nextId++,
      title: '📚 Cursos por completar',
      message: `Tienes ${pendingCourses} ${pendingCourses === 1 ? 'curso pendiente' : 'cursos pendientes'} por completar. ¡Sigue avanzando!`
    });
  }

  // Anuncio sobre próximos eventos
  announcements.push({
    id: nextId++,
    title: '🎯 Próximo evento',
    message: 'Webinar gratuito: "Técnicas avanzadas de manejo defensivo" - Este jueves a las 18:00'
  });

  // Tips de seguridad vial
  announcements.push({
    id: nextId++,
    title: '💡 Tip del día',
    message: 'Recuerda: "La prevención es la clave de la seguridad vial. Mantén siempre la distancia de seguimiento adecuada."'
  });

  // Anuncio de nuevos cursos
  announcements.push({
    id: nextId++,
    title: '🆕 ¡Nuevos cursos disponibles!',
    message: 'Descubre nuestros nuevos cursos: "Manejo en condiciones adversas" y "Primeros auxilios en la carretera"'
  });

  // Recordatorio de certificación
  if (enrollmentsData.some(e => e.status === 'completado')) {
    announcements.push({
      id: nextId++,
      title: '🏆 ¡Felicitaciones!',
      message: '¿Ya descargaste tus certificados de los cursos completados? Revisa tu perfil.'
    });
  }

  // Promoción especial
  announcements.push({
    id: nextId++,
    title: '🎉 Oferta especial',
    message: '20% de descuento en todos nuestros cursos técnicos durante esta semana. ¡No te lo pierdas!'
  });

  return announcements;
};

onMounted(async () => {
  // Recuperar información del usuario del localStorage
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    router.push('/login/estudiante')
    return
  }

  userInfo.value = JSON.parse(storedUser)

  // Cargar las inscripciones del estudiante
  try {
    const response = await fetch(`http://localhost:3000/api/students/${userInfo.value.id}/enrollments`)
    const data = await response.json()
    if (data.success) {
      enrollments.value = data.enrollments
      // Generar y mostrar anuncios personalizados
      welcomeAnnouncements.value = generateWelcomeAnnouncements(userInfo.value, data.enrollments);
    }
  } catch (error) {
    console.error('Error al cargar las inscripciones:', error)
  }
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login/estudiante')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
