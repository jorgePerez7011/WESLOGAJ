<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 pt-24 md:pt-32">
        <h1 class="text-4xl font-bold text-blue-900 mb-4">Campus Virtual ESLOGAJ</h1>
        <p class="text-xl text-gray-600">Bienvenido a tu plataforma de aprendizaje</p>
      </div>

      <!-- Tarjetas de acceso -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Estudiantes -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-blue-900 mb-4">Estudiantes</h2>
            <p class="text-gray-600 mb-6">Accede a tus cursos y gestiona tu aprendizaje</p>
            <div class="space-y-4">
              <router-link 
                to="/login/estudiante" 
                class="block w-full bg-blue-900 text-white text-center py-3 rounded-md hover:bg-blue-800 transition duration-300"
              >
                Iniciar Sesión
              </router-link>
              <router-link 
                to="/registro/estudiante" 
                class="block w-full bg-white text-blue-900 text-center py-3 rounded-md border-2 border-blue-900 hover:bg-blue-50 transition duration-300"
              >
                Registrarse
              </router-link>
            </div>
          </div>
        </div>

        <!-- Profesores -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-blue-900 mb-4">Profesores</h2>
            <p class="text-gray-600 mb-6">Gestiona tus cursos y estudiantes</p>
            <div class="space-y-4">
              <router-link 
                to="/login/profesor" 
                class="block w-full bg-blue-900 text-white text-center py-3 rounded-md hover:bg-blue-800 transition duration-300"
              >
                Iniciar Sesión
              </router-link>
              <router-link 
                to="/registro/profesor" 
                class="block w-full bg-white text-blue-900 text-center py-3 rounded-md border-2 border-blue-900 hover:bg-blue-50 transition duration-300"
              >
                Registrarse
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de características -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-blue-900">Cursos en línea</h3>
          <p class="text-gray-600 mt-2">Accede a contenido educativo de calidad desde cualquier lugar</p>
        </div>

        <div class="text-center">
          <div class="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-blue-900">Comunidad activa</h3>
          <p class="text-gray-600 mt-2">Interactúa con profesores y compañeros de estudio</p>
        </div>

        <div class="text-center">
          <div class="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-blue-900">Certificaciones</h3>
          <p class="text-gray-600 mt-2">Obtén certificados al completar tus cursos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica adicional por ahora
</script>
