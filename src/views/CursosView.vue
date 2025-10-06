<script setup>
import { ref, onMounted } from 'vue'

const showContent = ref(false)

onMounted(() => {
  showContent.value = true
})

const cursos = ref([
  {
    id: 1,
    name: 'Primeros Auxilios',
    //image: '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',
    image: 'https://emergencyglobalsystem.com/wp-content/uploads/2024/02/primeros-auxilios-en-un-avion.jpg',
    path: '/curso/primeros-auxilios',
    description: 'Aprende a conducir de manera segura y responsable con nuestro curso completo.'
  },
  {
    id: 2,
    name: 'Manejo Defensivo',
    image: 'https://storage.googleapis.com/sigo-blog-production/2024/12/SIGO-BLGOS-2023--1-.jpg',
    path: '/curso/manejo-defensivo',
    description: 'Técnicas avanzadas de manejo defensivo para prevenir accidentes.'
  },
  {
    id: 3,
    name: 'Mecánica Básica',
    image: 'https://mitsubishi-motors.com.co/blog/wp-content/uploads/2021/01/consejos-de-mecanica-basica.jpg',
    path: '/curso/mecanica-basica',
    description: 'Aprende los fundamentos de la mecánica automotriz.'
  },
  {
    id: 4,
    name: 'Normas de Tránsito',
    image: 'https://bogota.gov.co/sites/default/files/styles/1050px/public/2023-04/ventanilla.jpg',
    path: '/curso/normas-transito',
    description: 'Conoce y aprende todas las normas de tránsito vigentes.'
  },
  {
    id: 5,
    name: 'Transporte de Sustancias Peligrosas',
    image: 'https://logisber.com/contenido/subidas/2022/10/transporte-sustancias-peligrosas-terrestre-aereo-maritimo.jpg',
    path: '/curso/transporte-sustancias-peligrosas',
    description: 'Capacitación especializada en el manejo y transporte de sustancias peligrosas.'
  }
]).value.sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="container mx-auto px-4 pt-24 pb-16">
    <transition
      appear
      enter-active-class="transition duration-1000 ease-out"
      enter-from-class="opacity-0 transform -translate-y-12"
      enter-to-class="opacity-100 transform translate-y-0"
    >
      <div v-show="showContent">
        <h1 class="text-4xl font-bold text-blue-900 mb-8 text-center">Nuestros Cursos</h1>
        <p class="text-gray-600 text-lg mb-12 text-center max-w-3xl mx-auto">
          Explora nuestra completa selección de cursos diseñados para mejorar tus habilidades y conocimientos en el área automotriz y de transporte.
        </p>
      </div>
    </transition>
    
    <transition
      appear
      enter-active-class="transition duration-1000 ease-out"
      enter-from-class="opacity-0 transform translate-y-12"
      enter-to-class="opacity-100 transform translate-y-0"
    >
      <div v-show="showContent" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="curso in cursos" :key="curso.id" 
             class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
          <div class="relative h-48">
            <img :src="curso.image" :alt="curso.name" 
                 class="w-full h-full object-cover" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-blue-900 mb-2">{{ curso.name }}</h3>
            <p class="text-gray-600 mb-4">{{ curso.description }}</p>
            <router-link 
              :to="curso.path"
              class="inline-block bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-[#fbbd21] transition duration-300"
            >
              Ver más información
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.grid {
  transition: all 0.7s ease;
}
</style>
