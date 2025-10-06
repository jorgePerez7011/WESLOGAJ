<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)
const dropdownOpen = ref(false)
const studiosDropdownOpen = ref(false)

const isDashboardRoute = computed(() => {
  return route.path.includes('/dash/estudiante')
})


const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  dropdownOpen.value = false
  studiosDropdownOpen.value = false
}

const goHome = () => {
  router.push('/')
  if (menuOpen.value) {
    menuOpen.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  studiosDropdownOpen.value = false
}

const toggleStudiosDropdown = () => {
  studiosDropdownOpen.value = !studiosDropdownOpen.value
  dropdownOpen.value = false
}

// Add click outside listener to close dropdowns
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.dropdown-trigger')) {
      dropdownOpen.value = false
      studiosDropdownOpen.value = false
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <header v-if="!isDashboardRoute" class="bg-white shadow-sm fixed w-full top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <img src="/public/image.png" alt="Logo" class="h-8" />
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMenu" 
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-700 hover:bg-gray-100"
          >
            <svg 
              class="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                v-if="!menuOpen" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8 items-center">
            <button @click="goHome" class="text-blue-900 hover:text-blue-700 transition duration-300">INICIO</button>
            <!-- Estudios Dropdown -->
            <div class="relative">
              <button 
                @click="toggleStudiosDropdown"
                class="dropdown-trigger text-blue-900 hover:text-blue-700 flex items-center space-x-1 transition duration-300"
              >
                <span>ESTUDIOS</span>
                <svg 
                  class="w-4 h-4 ml-1 transform transition-transform duration-300" 
                  :class="{ 'rotate-180': studiosDropdownOpen }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <!-- Estudios Dropdown Menu -->
              <transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform -translate-y-2 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform -translate-y-2 opacity-0"
              >
                <div 
                  v-show="studiosDropdownOpen"
                  class="absolute left-0 mt-2 w-[800px] bg-white rounded-md shadow-lg py-4 z-50 grid grid-cols-3 gap-4 px-4"
                >
                  <!-- Cursos -->
                  <div>
                    <h3 class="font-bold text-lg text-blue-900 mb-3">CURSOS</h3>
                    <ul class="space-y-2">
                      <li><router-link to="/cursos/manejo-defensivo" class="block text-gray-700 hover:text-blue-600">Manejo Defensivo</router-link></li>
                      <li><router-link to="/cursos/primeros-auxilios" class="block text-gray-700 hover:text-blue-600">Primeros Auxilios</router-link></li>
                      <li><router-link to="/cursos/mecanica-basica" class="block text-gray-700 hover:text-blue-600">Mecánica Básica</router-link></li>
                      <li>
                        <router-link to="/cursos" class="text-blue-600 hover:text-blue-800 mt-2 block">
                          Ver más...
                        </router-link>
                      </li>
                    </ul>
                  </div>
                  
                  <!-- Técnicos Laborales -->
                  <div>
                    <h3 class="font-bold text-lg text-blue-900 mb-3">TÉCNICOS LABORALES</h3>
                    <ul class="space-y-2">
                      <li><router-link to="/tecnicos/auxiliar-administrativo-salud" class="block text-gray-700 hover:text-blue-600">Auxiliar Administrativo en Salud</router-link></li>
                      <li><router-link to="/tecnicos/auxiliar-administrativo" class="block text-gray-700 hover:text-blue-600">Auxiliar Administrativo</router-link></li>
                      <li><router-link to="/tecnicos/auxiliar-contable" class="block text-gray-700 hover:text-blue-600">Auxiliar Contable y Financiero</router-link></li>
                      <li>
                        <router-link to="/tecnicos" class="text-blue-600 hover:text-blue-800 mt-2 block">
                          Ver más...
                        </router-link>
                      </li>
                    </ul>
                  </div>
                  
                  <!-- Diplomados -->
                  <div>
                    <h3 class="font-bold text-lg text-blue-900 mb-3">DIPLOMADOS EN EDUCACIÓN</h3>
                    <ul class="space-y-2">
                      <li><router-link to="/diplomados/teorias-aprendizaje" class="block text-gray-700 hover:text-blue-600">Teorías del Aprendizaje y Modelos Pedagógicos</router-link></li>
                      <li><router-link to="/diplomados/aprendizaje-proyectos" class="block text-gray-700 hover:text-blue-600">Aprendizaje Basado en Proyectos</router-link></li>
                      <li><router-link to="/diplomados/coaching-educativo" class="block text-gray-700 hover:text-blue-600">Coaching Educativo</router-link></li>
                      <li>
                        <router-link to="/diplomados" class="text-blue-600 hover:text-blue-800 mt-2 block">
                          Ver más...
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
            <!-- Institución Dropdown -->
            <div class="relative">
              <button 
                @click="toggleDropdown"
                class="dropdown-trigger text-blue-900 hover:text-blue-700 flex items-center space-x-1 transition duration-300"
              >
                <span>INSTITUCIÓN</span>
                <svg 
                  class="w-4 h-4 ml-1 transform transition-transform duration-300" 
                  :class="{ 'rotate-180': dropdownOpen }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform -translate-y-2 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform -translate-y-2 opacity-0"
              >
                <div 
                  v-show="dropdownOpen"
                  class="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <router-link 
                    to="/quienes-somos" 
                    class="block px-4 py-2 text-blue-900 hover:bg-blue-50"
                  >
                    ¿Quiénes somos?
                  </router-link>
                  <router-link 
                    to="/politica-datos" 
                    class="block px-4 py-2 text-blue-900 hover:bg-blue-50"
                  >
                    Política de tratamiento de datos
                  </router-link>
                  <router-link 
                    to="/autorizacion-datos" 
                    class="block px-4 py-2 text-blue-900 hover:bg-blue-50"
                  >
                    Autorización de tratamiento de datos
                  </router-link>
                </div>
              </transition>
            </div>
            <router-link to="/estudios" class="text-blue-900 hover:text-blue-700">ESTUDIOS</router-link>
            <router-link to="/inscripciones" class="text-blue-900 hover:text-blue-700">INSCRIPCIONES</router-link>
            <router-link to="/campus-virtual" class="text-blue-900 hover:text-blue-700">CAMPUS VIRTUAL</router-link>
          </nav>

          <!-- Desktop Contact Info -->
          <div class="hidden md:flex items-center space-x-4">
            <a href="tel:+573162514328" class="text-gray-600 hover:text-blue-700">
              (+57) 316 2514328
            </a>
            <a href="mailto:Eslogaj@Eslogaj.edu.co" class="text-gray-600 hover:text-blue-700">
              Eslogaj@Eslogaj.edu.co
            </a>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div 
          v-show="menuOpen" 
          class="md:hidden py-4 space-y-4"
        >
          <nav class="flex flex-col space-y-4">
            <button 
              @click="goHome"
              class="text-blue-900 hover:text-blue-700 transition duration-300 text-left w-full"
            >
              INICIO
            </button>
            <!-- Institución Section in Mobile Menu -->
            <div class="space-y-2">
              <div class="text-blue-900 font-medium">INSTITUCIÓN</div>
              <div class="pl-4 space-y-2">
                <router-link 
                  to="/quienes-somos" 
                  class="block text-blue-900 hover:text-blue-700"
                  @click="toggleMenu"
                >
                  ¿Quiénes somos?
                </router-link>
                <router-link 
                  to="/politica-datos" 
                  class="block text-blue-900 hover:text-blue-700"
                  @click="toggleMenu"
                >
                  Política de tratamiento de datos
                </router-link>
                <router-link 
                  to="/autorizacion-datos" 
                  class="block text-blue-900 hover:text-blue-700"
                  @click="toggleMenu"
                >
                  Autorización de tratamiento de datos
                </router-link>
              </div>
            </div>
            <router-link to="/medios-pago" class="text-blue-900 hover:text-blue-700" @click="toggleMenu">MEDIOS DE PAGO</router-link>
            <router-link to="/inscripciones" class="text-blue-900 hover:text-blue-700" @click="toggleMenu">INSCRIPCIONES</router-link>
            <router-link to="/campus-virtual" class="text-blue-900 hover:text-blue-700" @click="toggleMenu">CAMPUS VIRTUAL</router-link>
          </nav>
          <div class="flex flex-col space-y-2 pt-4 border-t">
            <a href="tel:+573162514328" class="text-gray-600 hover:text-blue-700">
              (+57) 316 2514328
            </a>
            <a href="mailto:Eslogaj@Eslogaj.edu.co" class="text-gray-600 hover:text-blue-700">
              Eslogaj@Eslogaj.edu.co
            </a>
          </div>
        </div>
      </div>
    </header>

    <div :class="{'pt-16': !isDashboardRoute}">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Smooth page transitions */
.router-link-active {
  color: #1E3A8A;
  font-weight: 500;
}

/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile menu animations */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.5s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

