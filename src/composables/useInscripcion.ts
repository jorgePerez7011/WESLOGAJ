import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useInscripcion() {
  const router = useRouter()
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)

  const inscribirse = async (courseName: string, courseType: string, duration: string, price: number) => {
    loading.value = true
    error.value = ''
    
    // Obtener el usuario del localStorage
    const userJson = localStorage.getItem('user')
    if (!userJson) {
      router.push('/login/estudiante')
      return
    }

    const user = JSON.parse(userJson)

    try {
      const response = await fetch('http://localhost:3000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: user.id,
          courseName,
          courseType,
          duration,
          price
        })
      })

      const data = await response.json()

      if (data.success) {
        success.value = true
        setTimeout(() => {
          router.push({
            path: '/estudiante/dashboard',
            query: { inscripcionExitosa: 'true', curso: courseName }
          })
        }, 2000)
      } else {
        error.value = data.message || 'Error al inscribirse en el curso'
      }
    } catch (e) {
      error.value = 'Error al conectar con el servidor'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    inscribirse
  }
}
