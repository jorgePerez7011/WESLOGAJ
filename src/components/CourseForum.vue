<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Foro del Curso</h2>

      <!-- Formulario para nuevo mensaje -->
      <div class="mb-6 bg-gray-50 p-4 rounded-lg">
        <div class="flex gap-4">
          <img :src="currentUser.image_url || '/default-avatar.png'"
               :alt="currentUser.name"
               class="w-10 h-10 rounded-full object-cover" />
          <div class="flex-1">
            <textarea
              v-model="newMessage"
              placeholder="Escribe un mensaje..."
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button
                @click="postMessage"
                :disabled="!newMessage.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de mensajes -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-else class="space-y-6">
        <div v-for="post in posts" :key="post.id" class="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
          <div class="flex gap-4">
            <img :src="post.user_image || '/default-avatar.png'"
                 :alt="post.user_name"
                 class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium">{{ post.user_name }}</h4>
                  <p class="text-sm text-gray-500">
                    {{ post.created_at }}
                    <span v-if="post.user_type === 'teacher'" class="ml-2 text-blue-600">(Profesor)</span>
                    <span v-else-if="post.user_type === 'student'" class="ml-2 text-green-600">(Estudiante)</span>
                  </p>
                </div>
                <button
                  v-if="canDeletePost(post)"
                  @click="deletePost(post.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <span class="sr-only">Eliminar mensaje</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p class="mt-2 text-gray-700 whitespace-pre-line">{{ post.message }}</p>
            </div>
          </div>
        </div>

        <div v-if="posts.length === 0" class="text-center py-8 text-gray-500">
          No hay mensajes en el foro todavía. ¡Sé el primero en participar!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  courseId: {
    type: [Number, String],
    required: true
  },
  currentUser: {
    type: Object,
    required: true,
    validator(value) {
      // Validar que el rol sea correcto
      return value && (value.role === 'student' || value.role === 'teacher');
    }
  }
})

// Verificar y ajustar el rol del usuario si es necesario
if (props.currentUser && props.currentUser.role === 'estudiante') {
  props.currentUser.role = 'student'
} else if (props.currentUser && props.currentUser.role === 'profesor') {
  props.currentUser.role = 'teacher'
}

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const newMessage = ref('')

const loadPosts = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(`http://localhost:3000/api/courses/${props.courseId}/forum`)
    if (!response.ok) throw new Error('Error al cargar los mensajes')
    
    const data = await response.json()
    if (data.success) {
      posts.value = data.posts
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'No se pudieron cargar los mensajes del foro'
  } finally {
    loading.value = false
  }
}

const postMessage = async () => {
  if (!newMessage.value.trim()) return

  try {
    // Asegurarse de que el userType sea el correcto
    const userType = props.currentUser.role === 'estudiante' ? 'student' : 
                    props.currentUser.role === 'profesor' ? 'teacher' : 
                    props.currentUser.role; // usar el valor tal cual si ya es 'student' o 'teacher'

    const response = await fetch(`http://localhost:3000/api/courses/${props.courseId}/forum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: props.currentUser.id,
        userType: userType,
        message: newMessage.value.trim()
      })
    })

    if (!response.ok) throw new Error('Error al publicar el mensaje')
    
    const data = await response.json()
    if (data.success) {
      // Agregar el nuevo mensaje al principio de la lista
      posts.value.unshift(data.post)
      newMessage.value = '' // Limpiar el campo
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    console.error('Error:', err)
    alert('No se pudo publicar el mensaje. Por favor, intenta nuevamente.')
  }
}

const deletePost = async (postId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este mensaje?')) return

  try {
    const response = await fetch(`http://localhost:3000/api/forum/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: props.currentUser.id,
        userType: props.currentUser.role
      })
    })

    if (!response.ok) throw new Error('Error al eliminar el mensaje')
    
    const data = await response.json()
    if (data.success) {
      // Eliminar el mensaje de la lista
      posts.value = posts.value.filter(post => post.id !== postId)
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    console.error('Error:', err)
    alert('No se pudo eliminar el mensaje. Por favor, intenta nuevamente.')
  }
}

const canDeletePost = (post) => {
  return post.user_id === props.currentUser.id && 
         post.user_type === props.currentUser.role
}

onMounted(() => {
  loadPosts()
})
</script>
