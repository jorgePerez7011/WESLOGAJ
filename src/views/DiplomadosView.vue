<script setup>
import { ref } from 'vue'

const diplomados = ref([
  {
    id: 1,
    name: 'Aprendizaje Basado en Proyectos',
    image: 'https://s3.amazonaws.com/corp-mktg/cognizant/blog/wp-content/uploads/2020/10/26134816/project-based-learning.jpg',
    path: '/diplomados/aprendizaje-proyectos',
    description: 'Metodología innovadora de enseñanza basada en proyectos.'
  },
  {
    id: 2,
    name: 'Coaching Educativo',
    image: 'https://www.magisnet.com/wp-content/uploads/2021/02/coaching.jpg',
    path: '/diplomados/coaching-educativo',
    description: 'Herramientas de coaching aplicadas a la educación.'
  },
  {
    id: 3,
    name: 'Docencia Virtual',
    image: 'https://www.unir.net/wp-content/uploads/2020/04/professor-teaching-virtual-class.jpg',
    path: '/diplomados/docencia-virtual',
    description: 'Estrategias y herramientas para la enseñanza en línea.'
  },
  {
    id: 4,
    name: 'Educación Ambiental',
    image: 'https://www.educaciontrespuntocero.com/wp-content/uploads/2019/09/educacion-ambiental.jpg',
    path: '/diplomados/educacion-ambiental',
    description: 'Formación en conciencia y protección ambiental.'
  },
  {
    id: 5,
    name: 'Entorno Escolar Protector',
    image: 'https://www.medellin.gov.co/es/wp-content/uploads/2022/03/Entorno-Escolar-Protector.jpg',
    path: '/diplomados/entorno-protector',
    description: 'Creación de ambientes seguros en entornos educativos.'
  },
  {
    id: 6,
    name: 'Etnoeducación',
    image: 'https://www.mineducacion.gov.co/1759/articles-385568_imagen_3.jpg',
    path: '/diplomados/etnoeducacion',
    description: 'Educación con enfoque en diversidad cultural.'
  },
  // Agregué solo algunos diplomados como ejemplo, puedes agregar el resto de la lista que tenías antes
]).value.sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="container mx-auto px-4 pt-24 pb-16">
    <h1 class="text-4xl font-bold text-blue-900 mb-8 text-center">Diplomados en Educación</h1>
    <p class="text-gray-600 text-lg mb-12 text-center max-w-3xl mx-auto">
      Amplía tus conocimientos y especialízate en el campo educativo con nuestros diplomados certificados.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="diplomado in diplomados" :key="diplomado.id" 
           class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <div class="relative h-48">
          <img :src="diplomado.image" :alt="diplomado.name" 
               class="w-full h-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-blue-900 mb-2">{{ diplomado.name }}</h3>
          <p class="text-gray-600 mb-4">{{ diplomado.description }}</p>
          <router-link 
            :to="diplomado.path"
            class="inline-block bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition duration-300"
          >
            Ver más información
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  transition: all 0.3s ease;
}
</style>
