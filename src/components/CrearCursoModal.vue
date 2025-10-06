<template>
  <div class="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
        <!-- Close button -->
        <div class="absolute top-0 right-0 p-4">
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span class="sr-only">Cerrar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Curso</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Tipo de curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Curso
              </label>
              <select 
                v-model="courseData.course_type"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                @change="updateDurationBasedOnType"
              >
                <option value="curso_corto">Curso < 160 hrs (no regulado)</option>
                <option value="curso_largo">Curso > 160 hrs (regulado)</option>
                <option value="diplomado">Diplomado</option>
                <option value="tecnico">Técnico Laboral (3 semestres)</option>
              </select>
            </div>

            <!-- Nombre del curso -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Curso
              </label>
              <input 
                type="text" 
                id="name"
                v-model="courseData.name"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Descripción -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea 
                id="description"
                v-model="courseData.description"
                rows="4"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <!-- Imagen -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Curso
              </label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label
                      class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Subir imagen</span>
                      <input 
                        type="file" 
                        class="sr-only" 
                        accept="image/*"
                        @change="handleImageUpload"
                      />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                </div>
              </div>
              <div v-if="courseData.image_preview" class="mt-2">
                <img :src="courseData.image_preview" alt="Vista previa" class="h-32 object-cover rounded">
              </div>
            </div>

            <!-- Duración -->
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
                Duración (en horas)
              </label>
              <input 
                type="number" 
                id="duration"
                v-model="courseData.duration"
                :readonly="courseData.course_type === 'tecnico'"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p v-if="courseData.course_type === 'tecnico'" class="mt-1 text-sm text-gray-500">
                La duración se establece automáticamente para Técnicos Laborales (3 semestres)
              </p>
            </div>

            <!-- Precio -->
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Precio (COP)
              </label>
              <input 
                type="number" 
                id="price"
                v-model="courseData.price"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Cupo máximo -->
            <div>
              <label for="maxStudents" class="block text-sm font-medium text-gray-700 mb-2">
                Cupo máximo de estudiantes
              </label>
              <input 
                type="number" 
                id="maxStudents"
                v-model="courseData.max_students"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <!-- Fechas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de inicio
                </label>
                <input 
                  type="date" 
                  id="startDate"
                  v-model="courseData.start_date"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de finalización
                </label>
                <input 
                  type="date" 
                  id="endDate"
                  v-model="courseData.end_date"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <!-- Horario -->
            <div>
              <label for="schedule" class="block text-sm font-medium text-gray-700 mb-2">
                Horario
              </label>
              <input 
                type="text" 
                id="schedule"
                v-model="courseData.schedule"
                placeholder="Ej: Lunes a Viernes, 8:00 AM - 12:00 PM"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <!-- Objetivos -->
            <div>
              <label for="objectives" class="block text-sm font-medium text-gray-700 mb-2">
                Objetivos del curso
              </label>
              <textarea 
                id="objectives"
                v-model="courseData.objectives"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe los objetivos de aprendizaje del curso"
                required
              ></textarea>
            </div>

            <!-- Requisitos -->
            <div>
              <label for="requirements" class="block text-sm font-medium text-gray-700 mb-2">
                Requisitos previos
              </label>
              <textarea 
                id="requirements"
                v-model="courseData.requirements"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Lista los requisitos necesarios para tomar el curso"
                required
              ></textarea>
            </div>

            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Estado del Curso
              </label>
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="active"
                  v-model="courseData.active"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="active" class="ml-2 block text-sm text-gray-900">
                  Activo y visible para estudiantes
                </label>
              </div>
            </div>

            <!-- Mensaje de error/éxito -->
            <div v-if="message" :class="{'text-green-600': !error, 'text-red-600': error}" class="mt-2 text-sm">
              {{ message }}
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="loading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ loading ? 'Creando...' : 'Crear Curso' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface CourseData {
  course_type: string;
  name: string;
  description: string;
  image_url?: string;
  image_preview?: string;
  duration: number;
  price: number;
  teacher_id: number;
  active: boolean;
  objectives?: string;
  requirements?: string;
  start_date?: string;
  end_date?: string;
  schedule?: string;
  max_students?: number;
}

const emit = defineEmits(['close', 'course-created'])

const loading = ref(false)
const message = ref('')
const error = ref(false)

const courseData = ref<CourseData>({
  course_type: 'curso_corto',
  name: '',
  description: '',
  duration: 0,
  price: 0,
  teacher_id: 0,
  active: true,
  objectives: '',
  requirements: '',
  start_date: '',
  end_date: '',
  schedule: '',
  max_students: 0
})

// Actualizar duración basado en el tipo de curso
const updateDurationBasedOnType = () => {
  switch (courseData.value.course_type) {
    case 'curso_corto':
      courseData.value.duration = 0 // El usuario puede establecer < 160
      break
    case 'curso_largo':
      courseData.value.duration = 160 // Mínimo 160 horas
      break
    case 'diplomado':
      courseData.value.duration = 120 // Duración típica de diplomado
      break
    case 'tecnico':
      courseData.value.duration = 1800 // Aproximadamente 3 semestres
      break
  }
}

// Validar duración según el tipo
watch(() => courseData.value.duration, (newDuration) => {
  if (courseData.value.course_type === 'curso_corto' && newDuration >= 160) {
    courseData.value.duration = 159
  }
  if (courseData.value.course_type === 'curso_largo' && newDuration < 160) {
    courseData.value.duration = 160
  }
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    courseData.value.image_preview = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Preparar la imagen para el envío
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await fetch('http://localhost:3000/api/courses/image', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    if (data.success) {
      courseData.value.image_url = data.image_url
    }
  } catch (e) {
    console.error('Error al subir la imagen:', e)
  }
}

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  error.value = false

  // Obtener el teacher_id del localStorage
  const teacher = JSON.parse(localStorage.getItem('teacher') || '{}')
  if (!teacher.id) {
    message.value = 'Error: No se encontró la información del profesor'
    error.value = true
    loading.value = false
    return
  }

  const formData = new FormData()
  
  // Agregar todos los campos del curso
  formData.append('name', courseData.value.name || '')
  formData.append('description', courseData.value.description || '')
  formData.append('course_type', courseData.value.course_type || '')
  formData.append('duration', String(courseData.value.duration || 0))
  formData.append('price', String(courseData.value.price || 0))
  formData.append('teacher_id', String(teacher.id))
  formData.append('objectives', courseData.value.objectives || '')
  formData.append('requirements', courseData.value.requirements || '')
  formData.append('start_date', courseData.value.start_date || '')
  formData.append('end_date', courseData.value.end_date || '')
  formData.append('schedule', courseData.value.schedule || '')
  formData.append('max_students', String(courseData.value.max_students || 0))

  // Agregar la imagen si existe
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput && fileInput.files && fileInput.files[0]) {
    formData.append('image', fileInput.files[0])
  }

  try {
    const response = await fetch('http://localhost:3000/api/courses', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (data.success) {
      message.value = 'Curso creado exitosamente'
      error.value = false
      emit('course-created')
      setTimeout(() => {
        emit('close')
      }, 1500)
    } else {
      message.value = data.message || 'Error al crear el curso'
      error.value = true
    }
  } catch (e) {
    message.value = 'Error al crear el curso'
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
