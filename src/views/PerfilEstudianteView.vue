<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Tu Perfil</h3>
          
          <!-- Foto de perfil -->
          <div class="mt-5 text-center">
            <div class="flex flex-col items-center">
              <div class="relative">
                <img 
                  :src="userInfo.image_url ? `http://localhost:3000${userInfo.image_url}` : '/default-avatar.png'" 
                  class="w-32 h-32 rounded-full object-cover border-4 border-blue-900"
                  alt="Foto de perfil"
                />
                <label class="absolute bottom-0 right-0 bg-blue-900 rounded-full p-2 cursor-pointer hover:bg-blue-800">
                  <input 
                    type="file" 
                    class="hidden" 
                    accept="image/*"
                    @change="handleImageUpload"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
            </div>
          </div>

          <form class="mt-5 space-y-6" @submit.prevent="handleUpdate">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Nombre -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="userInfo.name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="userInfo.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Teléfono -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="userInfo.phone"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Tipo de documento -->
              <div>
                <label for="documentType" class="block text-sm font-medium text-gray-700">Tipo de documento</label>
                <select 
                  id="documentType" 
                  v-model="userInfo.document_type"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>

              <!-- Número de documento -->
              <div>
                <label for="documentNumber" class="block text-sm font-medium text-gray-700">Número de documento</label>
                <input 
                  type="text" 
                  id="documentNumber" 
                  v-model="userInfo.document_number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- País -->
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700">País</label>
                <select 
                  id="country" 
                  v-model="userInfo.country"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
                </select>
              </div>

              <!-- Nueva contraseña -->
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700">Nueva contraseña (opcional)</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  v-model="newPassword"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Mensaje de error/éxito -->
            <div v-if="message" :class="{'text-green-600': !error, 'text-red-600': error}" class="mt-2 text-sm">
              {{ message }}
            </div>

            <!-- Botón de guardar -->
            <div class="flex justify-end">
              <button 
                type="submit"
                :disabled="loading"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span v-if="loading">Guardando...</span>
                <span v-else>Guardar cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const userInfo = ref<UserInfo>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  document_type: '',
  document_number: '',
  country: '',
  image_url: ''
})

const countries = [
  'Colombia', 'Argentina', 'Chile', 'México', 'Perú', 'Ecuador', 'Venezuela', 'España', 'Estados Unidos', 'Otro'
]

const loading = ref(false)
const message = ref('')
const error = ref(false)
const newPassword = ref('')
const profileImage = ref('')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const userData = JSON.parse(storedUser)
    userInfo.value = { ...userData }
    if (userData.image_url) {
      profileImage.value = userData.image_url
    }
  }
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  const formData = new FormData()
  formData.append('image', file)
  formData.append('userId', userInfo.value.id.toString())

  try {
    loading.value = true
    const response = await fetch('http://localhost:3000/api/students/profile-image', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    if (data.success) {
      userInfo.value.image_url = data.image_url
      // Actualizar localStorage
      localStorage.setItem('user', JSON.stringify(userInfo.value))
      message.value = 'Foto de perfil actualizada correctamente'
      error.value = false
      // Emitir el evento para actualizar el dashboard
      emit('profile-updated')
    }
  } catch (e) {
    message.value = 'Error al actualizar la foto de perfil'
    error.value = true
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['profile-updated'])

const handleUpdate = async () => {
  loading.value = true
  message.value = ''
  error.value = false

  try {
    const response = await fetch(`http://localhost:3000/api/students/${userInfo.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userInfo.value,
        password: newPassword.value || undefined
      })
    })

    const data = await response.json()
    if (data.success) {
      // Actualizar userInfo con los datos devueltos por el servidor
      userInfo.value = { ...userInfo.value, ...data.user }
      // Guardar en localStorage los datos actualizados
      localStorage.setItem('user', JSON.stringify(userInfo.value))
      message.value = 'Perfil actualizado correctamente'
      error.value = false
      newPassword.value = ''
      emit('profile-updated') // Emitir evento cuando el perfil se actualiza
    } else {
      message.value = data.message || 'Error al actualizar el perfil'
      error.value = true
    }
  } catch (e) {
    message.value = 'Error al actualizar el perfil'
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
