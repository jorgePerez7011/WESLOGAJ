`<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Encabezado del curso -->
      <div class="bg-gray-800 text-white p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ courseData.name }}</h1>
            <p class="text-gray-300">{{ courseData.description }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="saveCourse" 
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              :disabled="loading"
            >
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje de estado -->
      <div v-if="message" :class="['p-4 text-sm', error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
        {{ message }}
      </div>

      <!-- Tabs de navegación -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Contenido de las tabs -->
      <div class="p-6">
        <!-- Información General -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tipo de curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Curso
              </label>
              <select 
                v-model="courseData.course_type"
                class="form-select w-full rounded-md"
              >
                <option value="tecnico">Técnico</option>
                <option value="diplomado">Diplomado</option>
                <option value="certificacion">Certificación</option>
              </select>
            </div>

            <!-- Nombre del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Curso
              </label>
              <input 
                type="text"
                v-model="courseData.name"
                class="form-input w-full rounded-md"
              />
            </div>

            <!-- Duración -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Duración (horas)
              </label>
              <input 
                type="number"
                v-model="courseData.duration"
                class="form-input w-full rounded-md"
              />
            </div>

            <!-- Precio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <input 
                type="number"
                v-model="courseData.price"
                class="form-input w-full rounded-md"
              />
            </div>

            <!-- Cupo máximo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cupo máximo
              </label>
              <input 
                type="number"
                v-model="courseData.max_students"
                class="form-input w-full rounded-md"
              />
            </div>

            <!-- Fechas -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio
              </label>
              <input 
                type="date"
                v-model="courseData.start_date"
                class="form-input w-full rounded-md"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de finalización
              </label>
              <input 
                type="date"
                v-model="courseData.end_date"
                class="form-input w-full rounded-md"
              />
            </div>

            <!-- Horario -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Horario
              </label>
              <input 
                type="text"
                v-model="courseData.schedule"
                class="form-input w-full rounded-md"
                placeholder="Ej: Lunes a Viernes, 8:00 AM - 12:00 PM"
              />
            </div>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea 
              v-model="courseData.description"
              rows="4"
              class="form-textarea w-full rounded-md"
            ></textarea>
          </div>

          <!-- Objetivos -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Objetivos
            </label>
            <textarea 
              v-model="courseData.objectives"
              rows="4"
              class="form-textarea w-full rounded-md"
            ></textarea>
          </div>

          <!-- Requisitos -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Requisitos
            </label>
            <textarea 
              v-model="courseData.requirements"
              rows="4"
              class="form-textarea w-full rounded-md"
            ></textarea>
          </div>

          <!-- Imagen del curso -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Curso
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <div v-if="courseData.image_url" class="mb-4">
                  <img 
                    :src="'http://localhost:3000' + courseData.image_url" 
                    alt="Imagen del curso"
                    class="mx-auto h-32 object-cover rounded"
                  />
                </div>
                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Actualizar imagen</span>
                    <input 
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleImageUpload"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido del Curso -->
        <div v-if="activeTab === 'contenido'" class="space-y-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <!-- Mensaje cuando no hay módulos y no se está editando -->
            <div v-if="(!courseData.modules || courseData.modules.length === 0) && !isEditingNewModule" class="text-center py-10">
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay módulos en este curso</h3>
              <p class="text-gray-500 mb-4">Comienza agregando un nuevo módulo para organizar el contenido del curso.</p>
              <button 
                @click="showNewModuleForm"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar primer módulo
              </button>
            </div>

            <!-- Formulario para nuevo módulo -->
            <div v-if="isEditingNewModule" class="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Nuevo Módulo</h3>
              </div>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Título del módulo
                  </label>
                  <input 
                    type="text"
                    v-model="newModule.title"
                    class="form-input w-full rounded-md"
                    placeholder="Introduce el título del módulo"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del módulo
                  </label>
                  <textarea 
                    v-model="newModule.description"
                    rows="3"
                    class="form-textarea w-full rounded-md"
                    placeholder="Describe el contenido del módulo"
                  ></textarea>
                </div>

                <!-- Sección de recursos -->
                <div class="space-y-4">
                  <h4 class="font-medium text-gray-700">Recursos del módulo</h4>
                  
                  <!-- Lista de recursos -->
                  <div v-for="(resource, index) in newModule.resources" :key="index" 
                       class="p-4 bg-gray-50 rounded-md space-y-3">
                    <div class="flex justify-between items-start">
                      <input 
                        type="text"
                        v-model="resource.title"
                        class="form-input w-full rounded-md mb-2"
                        placeholder="Título del recurso"
                      />
                      <button 
                        @click="removeNewResource(index)"
                        class="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>

                    <!-- Campos específicos según el tipo de recurso -->
                    <div v-if="resource.type === 'document'" class="space-y-2">
                      <input 
                        type="file"
                        @change="e => handleNewResourceFile(e, index)"
                        class="form-input w-full"
                        accept=".pdf,.doc,.docx"
                      />
                      <div v-if="resource.fileName" class="text-sm text-gray-600">
                        Archivo seleccionado: {{ resource.fileName }}
                      </div>
                    </div>

                    <div v-else-if="resource.type === 'video-url'" class="space-y-2">
                      <input 
                        type="text"
                        v-model="resource.url"
                        class="form-input w-full rounded-md"
                        placeholder="URL del video (YouTube, Vimeo, etc.)"
                      />
                    </div>

                    <div v-else-if="resource.type === 'video-file'" class="space-y-2">
                      <input 
                        type="file"
                        @change="e => handleNewResourceFile(e, index)"
                        class="form-input w-full"
                        accept="video/*"
                      />
                      <div v-if="resource.fileName" class="text-sm text-gray-600">
                        Video seleccionado: {{ resource.fileName }}
                      </div>
                    </div>

                    <div v-else-if="resource.type === 'link'" class="space-y-2">
                      <input 
                        type="text"
                        v-model="resource.url"
                        class="form-input w-full rounded-md mb-2"
                        placeholder="URL del enlace"
                      />
                      <input 
                        type="text"
                        v-model="resource.description"
                        class="form-input w-full rounded-md"
                        placeholder="Descripción del enlace"
                      />
                    </div>
                  </div>

                  <!-- Botones para agregar recursos -->
                  <div class="flex flex-wrap gap-2">
                    <button 
                      @click="addNewResource('document')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Documento
                    </button>
                    <button 
                      @click="addNewResource('video-url')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Video URL
                    </button>
                    <button 
                      @click="addNewResource('video-file')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Video Archivo
                    </button>
                    <button 
                      @click="addNewResource('link')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Enlace
                    </button>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    @click="cancelNewModule"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    @click="saveNewModule"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Guardar Módulo
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de módulos existentes -->
            <div v-if="courseData.modules && courseData.modules.length > 0" v-for="(module, moduleIndex) in courseData.modules" :key="moduleIndex" class="mb-8">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Módulo {{ moduleIndex + 1 }}</h3>
                <button 
                  @click="removeModule(moduleIndex)"
                  class="text-red-600 hover:text-red-800"
                >
                  Eliminar módulo
                </button>
              </div>

              <!-- Información del módulo -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Título del módulo
                  </label>
                  <input 
                    type="text"
                    v-model="module.title"
                    class="form-input w-full rounded-md"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del módulo
                  </label>
                  <textarea 
                    v-model="module.description"
                    rows="3"
                    class="form-textarea w-full rounded-md"
                  ></textarea>
                </div>

                <!-- Recursos del módulo -->
                <div class="space-y-4">
                  <h4 class="font-medium text-gray-700">Recursos</h4>
                  
                  <!-- Lista de recursos -->
                  <div v-for="(resource, resourceIndex) in module.resources" :key="resourceIndex" class="p-4 bg-gray-50 rounded-md">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex-1">
                        <input 
                          type="text"
                          v-model="resource.title"
                          class="form-input w-full rounded-md mb-2"
                          placeholder="Título del recurso"
                        />
                        
                        <div v-if="resource.type === 'document'" class="space-y-2">
                          <input 
                            type="file"
                            accept=".pdf,.doc,.docx"
                            @change="e => handleFileUpload(e, moduleIndex, resourceIndex)"
                            class="form-input w-full"
                          />
                          <div v-if="resource.name" class="text-sm text-gray-600">
                            Archivo actual: {{ resource.name }}
                          </div>
                        </div>

                        <div v-else-if="resource.type === 'video-url'" class="space-y-2">
                          <input 
                            type="text"
                            v-model="resource.url"
                            class="form-input w-full rounded-md"
                            placeholder="URL del video"
                          />
                        </div>

                        <div v-else-if="resource.type === 'video-file'" class="space-y-2">
                          <input 
                            type="file"
                            accept="video/*"
                            @change="e => handleFileUpload(e, moduleIndex, resourceIndex)"
                            class="form-input w-full"
                          />
                          <div v-if="resource.name" class="text-sm text-gray-600">
                            Video actual: {{ resource.name }}
                          </div>
                        </div>

                        <div v-else-if="resource.type === 'link'" class="space-y-2">
                          <input 
                            type="text"
                            v-model="resource.url"
                            class="form-input w-full rounded-md mb-2"
                            placeholder="URL del enlace"
                          />
                          <input 
                            type="text"
                            v-model="resource.description"
                            class="form-input w-full rounded-md"
                            placeholder="Descripción del enlace"
                          />
                        </div>
                      </div>
                      
                      <button 
                        @click="removeResource(moduleIndex, resourceIndex)"
                        class="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <!-- Botones para agregar recursos -->
                  <div class="flex space-x-2">
                    <button 
                      @click="addResource(moduleIndex, 'document')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Documento
                    </button>
                    <button 
                      @click="addResource(moduleIndex, 'video-url')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Video URL
                    </button>
                    <button 
                      @click="addResource(moduleIndex, 'video-file')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Video Archivo
                    </button>
                    <button 
                      @click="addResource(moduleIndex, 'link')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Enlace
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón para agregar nuevo módulo (visible siempre) -->
            <div class="mt-6">
              <button 
                v-if="courseData.modules && courseData.modules.length > 0 && !isEditingNewModule"
                @click="showNewModuleForm"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar otro módulo
              </button>
            </div>
          </div>
        </div>

        <!-- Estudiantes Inscritos -->
        <div v-if="activeTab === 'estudiantes'" class="space-y-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de inscripción
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in enrolledStudents" :key="student.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ student.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ student.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatDate(student.enrollment_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ student.status === 'active' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      @click="toggleStudentStatus(student.id)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      {{ student.status === 'active' ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tabs = [
  { id: 'general', name: 'Información General' },
  { id: 'contenido', name: 'Contenido del Curso' },
  { id: 'estudiantes', name: 'Estudiantes Inscritos' }
]

const activeTab = ref('general')
const loading = ref(false)
const message = ref('')
const error = ref(false)

interface Resource {
  id?: number
  type: 'document' | 'video-url' | 'video-file' | 'link'
  title: string
  description?: string
  url?: string
  file?: File | null
  name?: string
}

interface Module {
  id?: number
  title: string
  description: string
  resources: Resource[]
}

interface CourseData {
  id?: number
  name: string
  description: string
  course_type: string
  duration: number
  price: number
  teacher_id: number
  objectives: string
  requirements: string
  start_date: string
  end_date: string
  schedule: string
  max_students: number
  image_url?: string
  modules: Module[]
}

interface Student {
  id: number
  name: string
  email: string
  enrollment_date: string
  status: 'active' | 'inactive'
}

const courseData = ref<CourseData>({
  name: '',
  description: '',
  course_type: '',
  duration: 0,
  price: 0,
  teacher_id: 0,
  objectives: '',
  requirements: '',
  start_date: '',
  end_date: '',
  schedule: '',
  max_students: 0,
  modules: [] // Will be populated when loading course data
})

const isEditingNewModule = ref(false)
interface NewResource {
  type: 'document' | 'video-url' | 'video-file' | 'link'
  title: string
  description?: string
  url?: string
  file?: File | null
  fileName?: string
}

const newModule = ref({
  title: '',
  description: '',
  resources: [] as NewResource[]
})

const enrolledStudents = ref<Student[]>([])

// Cargar datos del curso
const loadCourseData = async () => {
  const courseId = route.params.id
  if (!courseId) return

  try {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`)
    if (!response.ok) throw new Error('Error al cargar el curso')
    
    const data = await response.json()
    if (data.success) {
      courseData.value = {
        ...data.course,
        modules: data.course.modules || [] // Aseguramos que siempre haya un array de módulos
      }
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = 'Error al cargar los datos del curso'
    error.value = true
  }
}

// Cargar estudiantes inscritos
const loadEnrolledStudents = async () => {
  const courseId = route.params.id
  if (!courseId) return

  try {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/students`)
    if (!response.ok) throw new Error('Error al cargar los estudiantes')
    
    const data = await response.json()
    if (data.success) {
      enrolledStudents.value = data.students
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

// Funciones para gestionar módulos
const showNewModuleForm = () => {
  isEditingNewModule.value = true
  newModule.value = {
    title: '',
    description: '',
    resources: [] as NewResource[]
  }
}

const addNewResource = (type: 'document' | 'video-url' | 'video-file' | 'link') => {
  const resource: NewResource = {
    type,
    title: '',
    url: type === 'video-url' || type === 'link' ? '' : undefined,
    description: type === 'link' ? '' : undefined,
    file: null
  }
  newModule.value.resources.push(resource)
}

const removeNewResource = (index: number) => {
  newModule.value.resources.splice(index, 1)
}

const handleNewResourceFile = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const resource = newModule.value.resources[index]
    
    if ((resource.type === 'document' && file.type.startsWith('application/')) ||
        (resource.type === 'video-file' && file.type.startsWith('video/'))) {
      resource.file = file
      resource.fileName = file.name
    } else {
      alert('Por favor, seleccione un archivo válido')
    }
  }
}

const cancelNewModule = () => {
  isEditingNewModule.value = false
  newModule.value = {
    title: '',
    description: '',
    resources: []
  }
}

const saveNewModule = async () => {
  try {
    if (!newModule.value.title.trim()) {
      message.value = 'El título del módulo es obligatorio'
      error.value = true
      return
    }

    // Crear FormData para enviar archivos
    const formData = new FormData()
    formData.append('title', newModule.value.title)
    formData.append('description', newModule.value.description)
    
    // Preparar los recursos
    const resources = newModule.value.resources.map(resource => {
      const resourceData = {
        type: resource.type,
        title: resource.title,
        url: resource.url,
        description: resource.description
      }
      
      // Si hay un archivo, lo agregamos al FormData
      if (resource.file) {
        const fileKey = resource.type === 'document' ? 'documents' : 'videos'
        formData.append(fileKey, resource.file)
      }
      
      return resourceData
    })
    
    formData.append('resources', JSON.stringify(resources))

    // Agregar el módulo a la base de datos
    const response = await fetch(`http://localhost:3000/api/courses/${route.params.id}/modules`, {
      method: 'POST',
      body: formData
    })

    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al crear el módulo')
    }

    if (responseData.success) {
      // Agregar el módulo a la lista local
      courseData.value.modules.push({
        id: responseData.moduleId,
        title: newModule.value.title,
        description: newModule.value.description,
        resources: []
      })
      
      // Limpiar el formulario y ocultarlo
      isEditingNewModule.value = false
      newModule.value = {
        title: '',
        description: '',
        resources: []
      }
      
      // Actualizar el módulo con el ID recibido
      const lastIndex = courseData.value.modules.length - 1
      courseData.value.modules[lastIndex] = {
        ...courseData.value.modules[lastIndex],
        id: responseData.moduleId
      }
      
      message.value = 'Módulo creado exitosamente'
      error.value = false
      
      // Recargar los datos del curso para asegurar consistencia
      await loadCourseData()
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = err instanceof Error ? `Error al crear el módulo: ${err.message}` : 'Error al crear el módulo'
    error.value = true
  }
}

const removeModule = async (index: number) => {
  const module = courseData.value.modules[index]
  if (!module.id) return

  try {
    const response = await fetch(`http://localhost:3000/api/modules/${module.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Error al eliminar el módulo')

    const data = await response.json()
    if (data.success) {
      courseData.value.modules.splice(index, 1)
      message.value = 'Módulo eliminado exitosamente'
      error.value = false
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = 'Error al eliminar el módulo'
    error.value = true
  }
}

// Funciones para gestionar recursos
const addResource = (moduleIndex: number, resourceType: 'document' | 'video-url' | 'video-file' | 'link') => {
  const module = courseData.value.modules[moduleIndex]
  
  if (resourceType === 'document') {
    module.resources.push({
      type: 'document',
      title: '',
      file: null,
      name: ''
    })
  } else if (resourceType === 'video-url') {
    module.resources.push({
      type: 'video-url',
      title: '',
      url: ''
    })
  } else if (resourceType === 'video-file') {
    module.resources.push({
      type: 'video-file',
      title: '',
      file: null,
      name: ''
    })
  } else if (resourceType === 'link') {
    module.resources.push({
      type: 'link',
      title: '',
      url: '',
      description: ''
    })
  }
}

const removeResource = (moduleIndex: number, resourceIndex: number) => {
  courseData.value.modules[moduleIndex].resources.splice(resourceIndex, 1)
}

const handleFileUpload = (event: Event, moduleIndex: number, resourceIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const resource = courseData.value.modules[moduleIndex].resources[resourceIndex]
    
    if ((resource.type === 'document' && file.type.startsWith('application/')) ||
        (resource.type === 'video-file' && file.type.startsWith('video/'))) {
      resource.file = file
      resource.name = file.name
    } else {
      alert('Por favor, seleccione un archivo válido')
    }
  }
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.type.startsWith('image/')) {
      const formData = new FormData()
      formData.append('image', file)
      
      // Subir la imagen
      updateCourseImage(formData)
    } else {
      alert('Por favor, seleccione una imagen válida')
    }
  }
}

// Función para subir la imagen del curso
const updateCourseImage = async (formData: FormData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${route.params.id}/image`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Error al subir la imagen')
    
    const data = await response.json()
    if (data.success) {
      courseData.value.image_url = data.image_url
      message.value = 'Imagen actualizada correctamente'
      error.value = false
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = 'Error al subir la imagen'
    error.value = true
  }
}

// Función para guardar los cambios del curso
const saveCourse = async () => {
  loading.value = true
  message.value = ''
  error.value = false

  try {
    // Prepara los datos del formulario
    const formData = new FormData();
    formData.append('name', courseData.value.name);
    formData.append('description', courseData.value.description);
    formData.append('course_type', courseData.value.course_type);
    formData.append('duration', courseData.value.duration.toString());
    formData.append('price', courseData.value.price.toString());
    formData.append('objectives', courseData.value.objectives || '');
    formData.append('requirements', courseData.value.requirements || '');
    formData.append('start_date', courseData.value.start_date || '');
    formData.append('end_date', courseData.value.end_date || '');
    formData.append('schedule', courseData.value.schedule || '');
    formData.append('max_students', courseData.value.max_students?.toString() || '0');
    
    // Prepara los módulos
    const modulesData = courseData.value.modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      resources: module.resources.map(resource => ({
        id: resource.id,
        type: resource.type,
        title: resource.title,
        url: resource.url,
        description: resource.description,
      }))
    }));
    
    formData.append('modules', JSON.stringify(modulesData));

    const response = await fetch(`http://localhost:3000/api/courses/${route.params.id}`, {
      method: 'PUT',
      body: formData
    })

    if (!response.ok) throw new Error('Error al guardar los cambios')

    const data = await response.json()
    if (data.success) {
      message.value = 'Cambios guardados correctamente'
      error.value = false
    } else {
      throw new Error(data.message || 'Error al guardar los cambios')
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = 'Error al guardar los cambios'
    error.value = true
  } finally {
    loading.value = false
  }
}

// Función para cambiar el estado de un estudiante
const toggleStudentStatus = async (studentId: number) => {
  try {
    const student = enrolledStudents.value.find(s => s.id === studentId)
    if (!student) return

    const response = await fetch(`http://localhost:3000/api/enrollments/${studentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: student.status === 'active' ? 'inactive' : 'active'
      })
    })

    if (!response.ok) throw new Error('Error al actualizar el estado')

    const data = await response.json()
    if (data.success) {
      student.status = student.status === 'active' ? 'inactive' : 'active'
      message.value = 'Estado actualizado correctamente'
      error.value = false
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = 'Error al actualizar el estado del estudiante'
    error.value = true
  }
}

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadCourseData()
  loadEnrolledStudents()
})
</script>`
