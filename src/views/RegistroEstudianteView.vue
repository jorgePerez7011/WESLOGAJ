<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const emailVerify = ref('')
const password = ref('')
const phone = ref('')
const documentType = ref('CC')
const documentNumber = ref('')
const country = ref('Colombia')
const error = ref('')
const loading = ref(false)

const countries = [
  'Colombia', 'Argentina', 'Chile', 'México', 'Perú', 'Ecuador', 'Venezuela', 'España', 'Estados Unidos', 'Otro'
]

const validateEmail = (email: string) => {
  // Expresión regular básica para email
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

const validatePassword = (password: string) => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un caracter especial
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)
}

const handleRegister = async () => {
  if (!name.value || !email.value || !emailVerify.value || !password.value || !documentNumber.value) {
    error.value = 'Por favor completa todos los campos obligatorios.'
    return
  }
  if (email.value !== emailVerify.value) {
    error.value = 'Los correos electrónicos no coinciden.'
    return
  }
  if (!validateEmail(email.value)) {
    error.value = 'El correo electrónico no es válido.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value || '',
        document_type: documentType.value,
        document_number: documentNumber.value,
        country: country.value
      })
    })
    const data = await response.json()
    if (data.success) {
      router.push('/login/estudiante')
    } else {
      error.value = data.message || 'Error al registrar. Intenta de nuevo.'
    }
  } catch (e) {
    error.value = 'Error al registrar. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-blue-900">
        Registro Estudiante
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Crea tu cuenta para acceder a los cursos
      </p>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input id="name" v-model="name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input id="email" v-model="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="emailVerify" class="block text-sm font-medium text-gray-700">Verifica tu correo electrónico</label>
            <input id="emailVerify" v-model="emailVerify" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" v-model="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
            <input id="phone" v-model="phone" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">País</label>
            <select id="country" v-model="country" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option v-for="pais in countries" :key="pais" :value="pais">{{ pais }}</option>
            </select>
          </div>
          <div>
            <label for="documentType" class="block text-sm font-medium text-gray-700">Tipo de documento</label>
            <select id="documentType" v-model="documentType" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="CC">Cédula de ciudadanía</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>
          <div>
            <label for="documentNumber" class="block text-sm font-medium text-gray-700">Número de documento</label>
            <input id="documentNumber" v-model="documentNumber" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-2xl text-sm font-medium text-white bg-blue-900 hover:bg-[#fbbd21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
              <span v-if="loading">Registrando...</span>
              <span v-else>Registrarse</span>
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
