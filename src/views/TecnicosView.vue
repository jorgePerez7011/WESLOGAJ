<script setup>
import { ref } from 'vue'

const tecnicos = ref([
  {
    id: 1,
    name: 'Asistente en Desarrollo de Software',
    image: 'https://www.hostinger.es/tutoriales/wp-content/uploads/sites/7/2021/08/full-stack-developer.png',
    path: '/tecnicos/asistente-desarrollo-software',
    description: 'Aprende a desarrollar aplicaciones y sistemas informáticos.'
  },
  {
    id: 2,
    name: 'Auxiliar Administrativo',
    image: 'https://www.iplacex.cl/hubfs/aux%20adm.jpg',
    path: '/tecnicos/auxiliar-administrativo',
    description: 'Formación integral en procesos administrativos y gestión de oficina.'
  },
  {
    id: 3,
    name: 'Auxiliar Administrativo en Calidad',
    image: 'https://www.isotools.org/wp-content/uploads/2015/03/Recursos-Humanos-y-Calidad.jpg',
    path: '/tecnicos/auxiliar-calidad',
    description: 'Especialización en sistemas de gestión de calidad.'
  },
  {
    id: 4,
    name: 'Auxiliar Administrativo en Salud',
    image: 'https://www.elempleo.com/co/files/news/2016/09/auxiliar_administrativo_en_salud.jpg',
    path: '/tecnicos/auxiliar-administrativo-salud',
    description: 'Gestión administrativa especializada en el sector salud.'
  },
  {
    id: 5,
    name: 'Auxiliar Contable y Financiero',
    image: 'https://www.grupoeducare.com/wp-content/uploads/2021/03/auxiliar-contable-min-scaled.jpg',
    path: '/tecnicos/auxiliar-contable',
    description: 'Formación en contabilidad básica y procesos financieros.'
  },
  {
    id: 6,
    name: 'Auxiliar de Talento Humano',
    image: 'https://www.piranirrhh.com/wp-content/uploads/2019/03/liderazgo-empresarial.jpg',
    path: '/tecnicos/auxiliar-talento-humano',
    description: 'Gestión de recursos humanos y procesos de personal.'
  },
  {
    id: 7,
    name: 'Auxiliar en Educación para la Primera Infancia',
    image: 'https://www.educacionbogota.edu.co/portal_institucional/sites/default/files/inline-images/primera-infancia.jpg',
    path: '/tecnicos/auxiliar-primera-infancia',
    description: 'Formación especializada en atención a la primera infancia.'
  },
  {
    id: 8,
    name: 'Auxiliar en Salud Oral',
    image: 'https://clinicadentalberges.es/wp-content/uploads/2021/02/auxiliar-dental.jpg',
    path: '/tecnicos/auxiliar-salud-oral',
    description: 'Capacitación en asistencia odontológica y salud oral.'
  },
  {
    id: 9,
    name: 'Mantenimiento de Computadores y Redes',
    image: 'https://www.unir.net/wp-content/uploads/2020/09/mantenimiento_informatico.jpg',
    path: '/tecnicos/mantenimiento-computadores',
    description: 'Aprende a mantener y reparar equipos informáticos y redes.'
  }
]).value.sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="container mx-auto px-4 pt-24 pb-16">
    <h1 class="text-4xl font-bold text-blue-900 mb-8 text-center">Programas Técnicos</h1>
    <p class="text-gray-600 text-lg mb-12 text-center max-w-3xl mx-auto">
      Descubre nuestros programas técnicos diseñados para formarte como profesional en distintas áreas laborales.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="tecnico in tecnicos" :key="tecnico.id" 
           class="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <div class="relative h-48">
          <img :src="tecnico.image" :alt="tecnico.name" 
               class="w-full h-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-blue-900 mb-2">{{ tecnico.name }}</h3>
          <p class="text-gray-600 mb-4">{{ tecnico.description }}</p>
          <router-link 
            :to="tecnico.path"
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
