<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-2xl font-semibold text-gray-800">Gestionar Curso</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-6">
        <!-- Mensaje de estado -->
        <div v-if="message" 
             :class="[
               'p-4 mb-4 rounded-md',
               !error ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
             ]"
        >
          {{ message }}
        </div>

        <!-- Información del curso -->
        <div class="course-info">
          <h3 class="section-title">Información General del Curso</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre del curso -->
            <div class="form-group">
              <label for="courseName">Nombre del Curso:</label>
              <input 
                type="text"
                id="courseName"
                v-model="courseData.name"
                class="form-input"
                placeholder="Ingrese el nombre del curso"
              >
            </div>

            <!-- Tipo de curso -->
            <div class="form-group">
              <label for="courseType">Tipo de Curso:</label>
              <select 
                id="courseType"
                v-model="courseData.course_type"
                class="form-select"
              >
                <option value="">Seleccione un tipo</option>
                <option value="tecnico">Técnico</option>
                <option value="diplomado">Diplomado</option>
                <option value="certificacion">Certificación</option>
              </select>
            </div>

            <!-- Duración -->
            <div class="form-group">
              <label for="courseDuration">Duración (horas):</label>
              <input 
                type="number"
                id="courseDuration"
                v-model="courseData.duration"
                class="form-input"
                min="1"
              >
            </div>

            <!-- Precio -->
            <div class="form-group">
              <label for="coursePrice">Precio:</label>
              <input 
                type="number"
                id="coursePrice"
                v-model="courseData.price"
                class="form-input"
                min="0"
                step="1000"
              >
            </div>

            <!-- Máximo de estudiantes -->
            <div class="form-group">
              <label for="maxStudents">Cupo máximo:</label>
              <input 
                type="number"
                id="maxStudents"
                v-model="courseData.max_students"
                class="form-input"
                min="1"
              >
            </div>

            <!-- Fecha de inicio -->
            <div class="form-group">
              <label for="startDate">Fecha de inicio:</label>
              <input 
                type="date"
                id="startDate"
                v-model="courseData.start_date"
                class="form-input"
              >
            </div>

            <!-- Fecha de finalización -->
            <div class="form-group">
              <label for="endDate">Fecha de finalización:</label>
              <input 
                type="date"
                id="endDate"
                v-model="courseData.end_date"
                class="form-input"
              >
            </div>

            <!-- Horario -->
            <div class="form-group">
              <label for="schedule">Horario:</label>
              <input 
                type="text"
                id="schedule"
                v-model="courseData.schedule"
                class="form-input"
                placeholder="Ej: Lunes a Viernes, 8:00 AM - 12:00 PM"
              >
            </div>
          </div>

          <!-- Descripción -->
          <div class="form-group mt-4">
            <label for="courseDescription">Descripción del Curso:</label>
            <textarea 
              id="courseDescription"
              v-model="courseData.description"
              class="form-input"
              rows="4"
              placeholder="Descripción detallada del curso"
            ></textarea>
          </div>

          <!-- Objetivos -->
          <div class="form-group">
            <label for="courseObjectives">Objetivos del Curso:</label>
            <textarea 
              id="courseObjectives"
              v-model="courseData.objectives"
              class="form-input"
              rows="4"
              placeholder="Objetivos de aprendizaje del curso"
            ></textarea>
          </div>

          <!-- Requisitos -->
          <div class="form-group">
            <label for="courseRequirements">Requisitos Previos:</label>
            <textarea 
              id="courseRequirements"
              v-model="courseData.requirements"
              class="form-input"
              rows="4"
              placeholder="Requisitos necesarios para tomar el curso"
            ></textarea>
          </div>

          <!-- Imagen del curso -->
          <div class="form-group">
            <label>Imagen del Curso:</label>
            <div class="file-upload-container">
              <input 
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
                id="courseImage"
              >
              <label for="courseImage" class="file-label">
                <span v-if="!courseImage">Seleccionar imagen</span>
                <span v-else class="file-name">{{ courseImage.name }}</span>
              </label>
              <div v-if="courseData.image_url || previewUrl" class="image-preview">
                <img :src="previewUrl || 'http://localhost:3000' + courseData.image_url" 
                     alt="Preview" 
                     class="preview-image"
                >
                <button @click="removeImage" class="remove-image">×</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Módulos -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-800">Contenido del Curso</h3>
          
          <!-- Formulario de módulo -->
          <div class="bg-white rounded-lg shadow p-6 space-y-6">
            <div class="border-b pb-4">
              <h4 class="text-lg font-medium text-gray-700">Información del Módulo</h4>
            </div>
            
            <div class="space-y-4">
              <div>
                <label for="moduleTitle" class="block text-sm font-medium text-gray-700 mb-1">
                  Título del Módulo:
                </label>
                <input 
                  id="moduleTitle"
                  type="text" 
                  v-model="currentModule.title" 
                  placeholder="Ej: Introducción al Manejo Defensivo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              
              <div>
                <label for="moduleDescription" class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Módulo:
                </label>
                <textarea 
                  id="moduleDescription"
                  v-model="currentModule.description" 
                  placeholder="Describe el contenido y objetivos de este módulo"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <!-- Recursos del módulo -->
              <div class="space-y-4">
                <h5 class="text-lg font-medium text-gray-700">Recursos del Módulo</h5>
                
                <!-- Documentos -->
                <div class="bg-gray-50 rounded-md p-4 space-y-3">
                  <label class="block text-sm font-medium text-gray-700">Documentos de Apoyo:</label>
                  <div class="flex items-center space-x-3">
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx"
                      @change="handleDocumentUpload"
                      class="hidden"
                      id="moduleDocument"
                    >
                    <label 
                      for="moduleDocument" 
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Agregar Documento
                    </label>
                  </div>
                  <!-- Lista de documentos -->
                  <div v-if="currentModule.resources.filter(r => r.type === 'document').length > 0" 
                       class="space-y-2">
                    <div v-for="(resource, idx) in currentModule.resources.filter(r => r.type === 'document')" 
                         :key="idx" 
                         class="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                      <span class="text-sm text-gray-600">{{ resource.title }}</span>
                      <button @click="removeResource(idx)" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Videos -->
                <div class="bg-gray-50 rounded-md p-4 space-y-3">
                  <label class="block text-sm font-medium text-gray-700">Videos del Módulo:</label>
                  <div class="flex items-center space-x-3">
                    <input 
                      type="text"
                      v-model="videoUrl"
                      placeholder="URL del video (YouTube, Vimeo, etc.)"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                    <button 
                      @click="addVideoResource"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Agregar Video
                    </button>
                  </div>
                  <!-- Lista de videos -->
                  <div v-if="currentModule.resources.filter(r => r.type === 'video-url').length > 0" 
                       class="space-y-2">
                    <div v-for="(resource, idx) in currentModule.resources.filter(r => r.type === 'video-url')" 
                         :key="idx" 
                         class="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                      <span class="text-sm text-gray-600">{{ resource.title }}</span>
                      <button @click="removeResource(idx)" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Enlaces -->
                <div class="bg-gray-50 rounded-md p-4 space-y-3">
                  <label class="block text-sm font-medium text-gray-700">Enlaces Adicionales:</label>
                  <div class="space-y-3">
                    <input 
                      type="text"
                      v-model="linkData.title"
                      placeholder="Título del enlace"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                    <div class="flex items-center space-x-3">
                      <input 
                        type="text"
                        v-model="linkData.url"
                        placeholder="URL del enlace"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                      <button 
                        @click="addLinkResource"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Agregar Enlace
                      </button>
                    </div>
                  </div>
                  <!-- Lista de enlaces -->
                  <div v-if="currentModule.resources.filter(r => r.type === 'link').length > 0" 
                       class="space-y-2">
                    <div v-for="(resource, idx) in currentModule.resources.filter(r => r.type === 'link')" 
                         :key="idx" 
                         class="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                      <span class="text-sm text-gray-600">{{ resource.title }}</span>
                      <button @click="removeResource(idx)" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  @click="saveModule"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Guardar Módulo
                </button>
              </div>
            </div>
          </div>

          <!-- Lista de módulos guardados -->
          <div v-if="courseData.modules.length > 0" class="mt-8 space-y-4">
            <h4 class="text-lg font-medium text-gray-700">Módulos Guardados</h4>
            <div class="space-y-4">
              <div v-for="(module, index) in courseData.modules" 
                   :key="index" 
                   class="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <h5 class="text-base font-medium text-gray-900">{{ module.title }}</h5>
                  <div class="flex space-x-2">
                    <button 
                      @click="editModule(index)" 
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Editar
                    </button>
                    <button 
                      @click="removeModule(index)" 
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ module.description }}</p>
                <div class="text-xs text-gray-500">
                  <span v-if="module.resources.length > 0">
                    {{ module.resources.length }} recurso(s)
                  </span>
                  <span v-else>Sin recursos</span>
                </div>
              </div>
            </div>
          </div>

            <!-- Recursos del módulo -->
            <div class="resources">
              <h5>Recursos del Módulo</h5>
              
              <!-- Documentos -->
              <div class="resource-group">
                <label>Documentos:</label>
                <div v-for="(resource, resourceIndex) in module.resources.filter(r => r.type === 'document')" :key="resourceIndex" class="resource-item">
                  <input 
                    type="text"
                    v-model="resource.title"
                    placeholder="Título del documento"
                    class="form-input"
                  >
                  <div class="file-upload-container">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      @change="handleFileUpload($event, index, resourceIndex)"
                      class="file-input"
                      :id="'doc-' + index + '-' + resourceIndex"
                    >
                    <label :for="'doc-' + index + '-' + resourceIndex" class="file-label">
                      <span v-if="!resource.file">Seleccionar documento</span>
                      <span v-else class="file-name">{{ resource.name }}</span>
                    </label>
                    <span v-if="resource.file" class="selected-file">
                      {{ resource.name }}
                      <button @click="() => { resource.file = null; resource.name = ''; }" class="remove-file">×</button>
                    </span>
                  </div>
                  <button @click="removeResource(index, resourceIndex)" class="remove-resource">
                    ×
                  </button>
                </div>
                <button @click="addResource(index, 'document')" class="add-resource-button">
                  + Agregar Documento
                </button>
              </div>

              <!-- Videos -->
              <div class="resource-group">
                <label>Videos:</label>
                <div v-for="(resource, resourceIndex) in module.resources.filter(r => r.type.startsWith('video'))" :key="resourceIndex" class="resource-item">
                  <input 
                    type="text"
                    v-model="resource.title"
                    placeholder="Título del video"
                    class="form-input"
                  >
                  <select 
                    :value="resource.type === 'video-url' ? 'url' : 'file'"
                    class="form-select"
                    @change="handleVideoTypeChange(index, resourceIndex)"
                  >
                    <option value="url">URL de Video</option>
                    <option value="file">Archivo de Video</option>
                  </select>
                  
                  <template v-if="resource.type === 'video-url'">
                    <input 
                      type="text" 
                      v-model="resource.url"
                      placeholder="URL del video"
                      class="form-input"
                    >
                  </template>
                  
                  <template v-else-if="resource.type === 'video-file'">
                    <div class="file-upload-container">
                      <input 
                        type="file" 
                        accept="video/*"
                        @change="handleVideoUpload($event, index, resourceIndex)"
                        class="file-input"
                        :id="'video-' + index + '-' + resourceIndex"
                      >
                      <label :for="'video-' + index + '-' + resourceIndex" class="file-label">
                        <span v-if="!resource.file">Seleccionar video</span>
                        <span v-else class="file-name">{{ resource.name }}</span>
                      </label>
                      <span v-if="resource.file" class="selected-file">
                        {{ resource.name }}
                        <button @click="removeVideoFile(index, resourceIndex)" class="remove-file">×</button>
                      </span>
                    </div>
                  </template>
                  
                  <button @click="removeResource(index, resourceIndex)" class="remove-resource">
                    ×
                  </button>
                </div>
                <button @click="addResource(index, 'video-url')" class="add-resource-button">
                  + Agregar Video
                </button>
              </div>

              <!-- Enlaces -->
              <div class="resource-group">
                <label>Enlaces:</label>
                <div v-for="(resource, resourceIndex) in module.resources.filter(r => r.type === 'link')" :key="resourceIndex" class="resource-item">
                  <input 
                    type="text"
                    v-model="resource.title"
                    placeholder="Título del enlace"
                    class="form-input"
                  >
                  <input 
                    type="text" 
                    v-model="resource.url"
                    placeholder="URL del enlace"
                    class="form-input"
                  >
                  <input 
                    type="text" 
                    v-model="resource.description"
                    placeholder="Descripción del enlace"
                    class="form-input"
                  >
                  <button @click="removeResource(index, resourceIndex)" class="remove-resource">
                    ×
                  </button>
                </div>
                <button @click="addResource(index, 'link')" class="add-resource-button">
                  + Agregar Enlace
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button @click="addModule" class="add-module-button">
            + Añadir Nuevo Módulo
          </button>
          <button @click="goBack" class="back-button">
            Volver al Dashboard
          </button>
          <button 
            @click="saveCourse" 
            class="save-button"
            :disabled="loading"
          >
            {{ loading ? 'Guardando...' : 'Guardar Curso' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  courseId?: number
}>(), {
  courseId: 0
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const message = ref('')
const error = ref(false)
const courseImage = ref<File | null>(null)
const previewUrl = ref<string>('')

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.type.startsWith('image/')) {
      courseImage.value = file
      previewUrl.value = URL.createObjectURL(file)
    } else {
      alert('Por favor, seleccione una imagen válida')
    }
  }
}

const removeImage = () => {
  courseImage.value = null
  previewUrl.value = ''
  courseData.value.image_url = ''
}

// Función para cargar los datos del curso existente
const loadExistingCourse = async () => {
  if (!props.courseId) return;
  
  try {
    // Cargar la información básica del curso
    const courseResponse = await fetch(`http://localhost:3000/api/courses/${props.courseId}`);
    if (!courseResponse.ok) {
      throw new Error('Error al cargar la información del curso');
    }
    
    const courseData = await courseResponse.json();
    if (courseData.success && courseData.course) {
      // Actualizar los datos del curso
      const course = courseData.course;
      courseData.value = {
        ...courseData.value,
        name: course.name,
        description: course.description,
        course_type: course.course_type,
        duration: course.duration,
        price: course.price,
        teacher_id: course.teacher_id,
        objectives: course.objectives,
        requirements: course.requirements,
        start_date: course.start_date,
        end_date: course.end_date,
        schedule: course.schedule,
        max_students: course.max_students,
        image_url: course.image_url
      };
    }

    // Cargar los módulos del curso
    const modulesResponse = await fetch(`http://localhost:3000/api/courses/${props.courseId}/modules`);
    if (!modulesResponse.ok) {
      throw new Error('Error al cargar los módulos');
    }
    
    const modulesData = await modulesResponse.json();
    if (modulesData.success && modulesData.modules) {
      // Transformar los recursos al formato que usa el componente
      courseData.value.modules = modulesData.modules.map(module => ({
        title: module.title,
        description: module.description,
        resources: [
          ...module.resources.documents.map(doc => ({
            type: 'document' as const,
            title: doc.title,
            file: null,
            name: doc.file_path?.split('/').pop() || ''
          })),
          ...module.resources.videos.map(video => 
            video.url 
              ? {
                  type: 'video-url' as const,
                  title: video.title,
                  url: video.url
                }
              : {
                  type: 'video-file' as const,
                  title: video.title,
                  file: null,
                  name: video.file_path?.split('/').pop() || ''
                }
          ),
          ...module.resources.links.map(link => ({
            type: 'link' as const,
            title: link.title,
            url: link.url,
            description: link.description
          }))
        ]
      }));
    }
  } catch (err) {
    console.error('Error al cargar los datos del curso:', err);
    message.value = 'Error al cargar los datos del curso';
    error.value = true;
  }
};

// Cargar los datos del curso cuando el componente se monta
onMounted(loadExistingCourse);

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

// Router para la navegación
import { useRouter } from 'vue-router'
const router = useRouter()

// Función para volver al listado de cursos
const goBack = () => {
  router.push('/profesor-dashboard')
}

// Variables reactivas para el manejo de módulos
const currentModule = ref({
  title: '',
  description: '',
  resources: []
})

const videoUrl = ref('')
const linkData = ref({
  title: '',
  url: ''
})

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
  modules: []
})

// Función para manejar la subida de documentos
const handleDocumentUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    currentModule.value.resources.push({
      type: 'document',
      title: file.name,
      file: file,
      name: file.name
    })
  }
}

// Función para agregar un recurso de video
const addVideoResource = () => {
  if (!videoUrl.value) return
  
  currentModule.value.resources.push({
    type: 'video-url',
    title: 'Video: ' + videoUrl.value,
    url: videoUrl.value
  })
  videoUrl.value = ''
}

// Función para agregar un enlace
const addLinkResource = () => {
  if (!linkData.value.title || !linkData.value.url) return
  
  currentModule.value.resources.push({
    type: 'link',
    title: linkData.value.title,
    url: linkData.value.url
  })
  linkData.value = { title: '', url: '' }
}

// Función para eliminar un recurso
const removeResource = (index: number) => {
  currentModule.value.resources.splice(index, 1)
}

// Función para guardar el módulo actual
const saveModule = () => {
  if (!currentModule.value.title) {
    message.value = 'Por favor, ingrese un título para el módulo'
    error.value = true
    return
  }

  courseData.value.modules.push({
    title: currentModule.value.title,
    description: currentModule.value.description,
    resources: [...currentModule.value.resources]
  })

  // Limpiar el formulario
  currentModule.value = {
    title: '',
    description: '',
    resources: []
  }

  message.value = 'Módulo guardado correctamente'
  error.value = false

  // Hacer scroll a la lista de módulos guardados
  setTimeout(() => {
    const savedModules = document.querySelector('.saved-modules')
    savedModules?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

// Función para editar un módulo existente
const editModule = (index: number) => {
  const module = courseData.value.modules[index]
  currentModule.value = {
    title: module.title,
    description: module.description,
    resources: [...module.resources]
  }
  removeModule(index)
}

const removeModule = (index: number) => {
  courseData.value.modules.splice(index, 1)
}

const removeModule = (index: number) => {
  courseData.value.modules.splice(index, 1)
}

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
  const module = courseData.value.modules[moduleIndex]
  module.resources.splice(resourceIndex, 1)
}

const handleFileUpload = (event: Event, moduleIndex: number, resourceIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const module = courseData.value.modules[moduleIndex]
    const resource = module.resources[resourceIndex]
    
    if (resource.type === 'document') {
      resource.file = file
      resource.name = file.name
      resource.title = file.name
    }
  }
}

const handleVideoUpload = (event: Event, moduleIndex: number, resourceIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.type.startsWith('video/')) {
      const module = courseData.value.modules[moduleIndex]
      const resource = module.resources[resourceIndex]
      
      if (resource.type === 'video-file') {
        resource.file = file
        resource.name = file.name
        resource.title = file.name
      }
    } else {
      alert('Por favor, seleccione un archivo de video válido')
    }
  }
}

const removeVideoFile = (moduleIndex: number, resourceIndex: number) => {
  const module = courseData.value.modules[moduleIndex]
  const resource = module.resources[resourceIndex]
  
  if (resource.type === 'video-file') {
    resource.file = null
    resource.name = ''
    resource.title = ''
  }
}

const handleVideoTypeChange = (moduleIndex: number, resourceIndex: number) => {
  const module = courseData.value.modules[moduleIndex]
  const resource = module.resources[resourceIndex]

  if (resource.type === 'video-url') {
    module.resources[resourceIndex] = {
      type: 'video-file',
      title: resource.title || '',
      file: null,
      name: ''
    }
  } else {
    module.resources[resourceIndex] = {
      type: 'video-url',
      title: resource.title || '',
      url: ''
    }
  }
}

const saveCourse = async () => {
  loading.value = true
  const formData = new FormData()

  // Validar que al menos el primer módulo tenga título
  if (!courseData.value.modules[0].title?.trim()) {
    message.value = 'Por favor, añade un título al primer módulo'
    error.value = true
    loading.value = false
    return
  }

  // Obtener el teacher_id del localStorage
  const teacher = JSON.parse(localStorage.getItem('teacher') || '{}')
  if (!teacher.id) {
    message.value = 'Error: No se encontró la información del profesor'
    error.value = true
    loading.value = false
    return
  }

  formData.append('name', courseData.value.name || '')
  formData.append('description', courseData.value.description || '')
  formData.append('course_type', courseData.value.course_type || '')
  formData.append('duration', courseData.value.duration ? String(courseData.value.duration) : '0')
  formData.append('price', courseData.value.price ? String(courseData.value.price) : '0')
  formData.append('max_students', courseData.value.max_students ? String(courseData.value.max_students) : '0')
  formData.append('start_date', courseData.value.start_date || '')
  formData.append('end_date', courseData.value.end_date || '')
  formData.append('schedule', courseData.value.schedule || '')
  formData.append('objectives', courseData.value.objectives || '')
  formData.append('requirements', courseData.value.requirements || '')
  formData.append('teacher_id', String(teacher.id))

  // Agregar la imagen del curso si existe
  if (courseImage.value) {
    formData.append('image', courseImage.value)
  }

  // Crear una copia de los módulos para procesar
  const modulesData = courseData.value.modules.map(module => {
    // Filtrar y mapear los recursos por tipo
    const documents = module.resources.filter(r => r.type === 'document')
    const videoUrls = module.resources.filter(r => r.type === 'video-url')
    const videoFiles = module.resources.filter(r => r.type === 'video-file')
    const links = module.resources.filter(r => r.type === 'link')

    // Agregar los archivos al FormData
    documents.forEach(doc => {
      if (doc.file) {
        formData.append('documents', doc.file, doc.name || doc.file.name)
      }
    })

    videoFiles.forEach(video => {
      if (video.file) {
        formData.append('videos', video.file, video.name || video.file.name)
      }
    })

    return {
      title: module.title,
      description: module.description,
      resources: [
        ...documents.map(doc => ({
          type: 'document',
          title: doc.title,
          file_name: doc.name || (doc.file ? doc.file.name : '')
        })),
        ...videoUrls.map(video => ({
          type: 'video-url',
          title: video.title,
          url: video.url
        })),
        ...videoFiles.map(video => ({
          type: 'video-file',
          title: video.title,
          file_name: video.name || (video.file ? video.file.name : '')
        })),
        ...links.map(link => ({
          type: 'link',
          title: link.title,
          url: link.url,
          description: link.description
        }))
      ]
    }
  });

  // Añadir los datos de los módulos
  formData.append('modules', JSON.stringify(modulesData));

  try {
    console.log('Enviando datos al servidor...');
    
    const url = props.courseId 
      ? `http://localhost:3000/api/courses/${props.courseId}`
      : 'http://localhost:3000/api/courses';

    const response = await fetch(url, {
      method: props.courseId ? 'PUT' : 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("La respuesta del servidor no es JSON!");
    }

    const data = await response.json();
    
    if (data.success) {
      message.value = 'Curso actualizado exitosamente';
      error.value = false;
      emit('save', data.course);
      emit('close');
    } else {
      message.value = data.message || 'Error al guardar el curso';
      error.value = true;
    }
  } catch (e) {
    console.error('Error al guardar el curso:', e);
    message.value = 'Error al guardar el curso';
    error.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
}

.modal-container {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.close-button {
  border: none;
  background: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

textarea.form-input {
  resize: vertical;
  min-height: 60px;
}

.module-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.resources {
  margin-top: 20px;
}

.resource-group {
  margin-bottom: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
}

.resource-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.remove-resource {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: flex-end;
}

.status-message {
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.add-module-button, .save-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.add-module-button[disabled],
.save-button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-module-button {
  background-color: #e9ecef;
  color: #495057;
}

.back-button {
  background-color: #6c757d;
  color: white;
}

.save-button {
  background-color: #0066cc;
  color: white;
}

.resources-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.resource-group {
  margin-bottom: 24px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.resource-group label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}

.resource-list {
  margin-top: 15px;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.resource-name {
  flex-grow: 1;
  margin-right: 10px;
}

.remove-resource {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.video-input-group,
.link-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.add-resource-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.saved-modules {
  margin-top: 30px;
  border-top: 2px solid #dee2e6;
  padding-top: 20px;
}

.saved-module {
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.saved-module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.saved-module-actions {
  display: flex;
  gap: 10px;
}

.edit-button {
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.saved-module-description {
  color: #6c757d;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.saved-module-resources {
  font-size: 0.85em;
  color: #6c757d;
}

.module-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.save-module-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-module-button:hover {
  background-color: #218838;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.add-resource-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.file-label:hover {
  background-color: #dee2e6;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: #e3f2fd;
  border-radius: 4px;
  color: #1976d2;
  font-size: 14px;
}

.remove-file {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
}

.remove-file:hover {
  color: #bd2130;
}

.form-select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-right: 10px;
  min-width: 150px;
}

.file-name {
  color: #0066cc;
  margin-left: 10px;
  font-size: 0.9em;
}
</style>
