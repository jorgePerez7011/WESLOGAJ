<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Obtener la información del curso si existe
const redirect = route.query.redirect as string
const cursoName = route.query.curso as string

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor ingresa todos los campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/login/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    const data = await response.json()
    if (data.success) {
      // Asegurarse de que el usuario tenga el rol de estudiante
      const userData = { ...data.user, role: 'student' }
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Si hay un curso pendiente de inscripción, inscribir al usuario
      if (cursoName) {
        try {
          const inscripcionResponse = await fetch('http://localhost:3000/api/inscripcion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
              userId: data.user.id,
              cursoName: cursoName
            })
          })
          const inscripcionData = await inscripcionResponse.json()
          if (inscripcionData.success) {
            // Redirigir al dashboard con mensaje de éxito
            router.push({
              path: '/estudiante/dashboard',
              query: { inscripcionExitosa: 'true', curso: cursoName }
            })
            return
          }
        } catch (e) {
          console.error('Error en la inscripción:', e)
        }
      }
      
      // Si no hay curso o falló la inscripción, redirigir a la ruta especificada o al dashboard
      router.push(redirect || '/estudiante/dashboard')
    } else {
      error.value = data.message || 'Credenciales incorrectas.'
    }
  } catch (e) {
    error.value = 'Error al iniciar sesión. Por favor intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-blue-900">
        Acceso Estudiantes
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingresa a tu cuenta para acceder a tus cursos
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-[#fbbd21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            >
              <span v-if="loading">Cargando...</span>
              <span v-else>Iniciar sesión</span>
            </button>
          </div>

          <div v-if="error" class="mt-4">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
