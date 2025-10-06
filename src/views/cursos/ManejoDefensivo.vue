<template>
  <div class="curso-detalle">
    <h1>Manejo Defensivo</h1>
    <div class="curso-info">
      <h2>Descripción del Curso</h2>
      <p>Técnicas avanzadas de manejo defensivo para prevenir accidentes.</p>
      
      <div class="detalles">
        <div class="detalle-item">
          <strong>Duración:</strong> 30 horas
        </div>
        <div class="detalle-item">
          <strong>Precio:</strong> $180,000
        </div>
        <div class="detalle-item">
          <strong>Tipo:</strong> Curso Corto
        </div>
      </div>

      <div class="contenido">
        <h3>Contenido del Curso</h3>
        <ul>
          <li>Principios del manejo defensivo</li>
          <li>Anticipación de riesgos en la vía</li>
          <li>Técnicas de prevención de accidentes</li>
          <li>Manejo en condiciones adversas</li>
          <li>Evaluación de situaciones de riesgo</li>
        </ul>
      </div>

      <div class="inscripcion">
        <!-- Mensaje de éxito -->
        <div v-if="success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ¡Inscripción exitosa! Redirigiendo al dashboard...
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>

        <!-- Mensaje de autenticación -->
        <div v-if="!isAuthenticated" class="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Para inscribirte en este curso, necesitas iniciar sesión primero
        </div>

        <button 
          class="btn-inscribirse" 
          @click="inscribirse" 
          :disabled="loading"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <span v-if="loading">
            Procesando inscripción...
          </span>
          <span v-else>
            {{ isAuthenticated ? 'Inscribirse al Curso' : 'Iniciar Sesión para Inscribirse' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ManejoDefensivo',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)
    const isAuthenticated = ref(false)

    // Verificar autenticación al montar el componente
    onMounted(() => {
      const userJson = localStorage.getItem('user')
      if (userJson) {
        try {
          const user = JSON.parse(userJson)
          if (user && user.id) {
            isAuthenticated.value = true
          } else {
            localStorage.removeItem('user')
          }
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
    })

    return {
      router,
      loading,
      error,
      success,
      isAuthenticated
    }
  },
  methods: {
    async inscribirse() {
      this.loading = true
      this.error = ''
      
      // Obtener el usuario del localStorage
      const userJson = localStorage.getItem('user')
      if (!userJson) {
        this.router.push('/login/estudiante')
        return
      }

      const user = JSON.parse(userJson)
      
      // Verificar que tenemos toda la información necesaria
      if (!user || !user.id) {
        // Si falta información del usuario, redirigir al login
        localStorage.removeItem('user') // Limpiar datos inválidos
        this.router.push('/login/estudiante')
        return
      }

      try {
        const response = await fetch('http://localhost:3000/api/enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: user.id,
            courseName: 'Manejo Defensivo',
            courseType: 'curso_corto',
            duration: 30,  // Enviamos solo el número
            price: 180000,
            description: 'Técnicas avanzadas de manejo defensivo para prevenir accidentes.'
          })
        })

        const data = await response.json()

        if (data.success) {
          this.success = true
          setTimeout(() => {
            this.router.push({
              path: '/estudiante/dashboard',
              query: { inscripcionExitosa: 'true', curso: 'Manejo Defensivo' }
            })
          }, 2000)
        } else {
          if (data.details) {
            // Si hay detalles del error, mostrarlos
            if (data.details.studentId === 'Falta ID del estudiante') {
              // Problema con la sesión del usuario
              localStorage.removeItem('user')
              this.router.push('/login/estudiante')
              return
            }
            this.error = `${data.message}: ${Object.values(data.details).join(', ')}`
          } else {
            this.error = data.message || 'Error al inscribirse en el curso'
          }
        }
      } catch (e) {
        console.error('Error de inscripción:', e)
        this.error = 'Error al conectar con el servidor. Por favor, inicia sesión nuevamente.'
        localStorage.removeItem('user')
        setTimeout(() => {
          this.router.push('/login/estudiante')
        }, 2000)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style scoped>
.curso-detalle {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.curso-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.detalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.detalle-item {
  padding: 10px;
}

.contenido {
  margin: 20px 0;
}

.contenido ul {
  list-style-type: none;
  padding: 0;
}

.contenido li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.btn-inscribirse {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.btn-inscribirse:hover {
  background-color: #45a049;
}
</style>
