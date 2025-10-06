<script setup>
import { ref, onMounted } from 'vue'

const showContent = ref(false)

onMounted(() => {
  showContent.value = true
})
</script>

<template>
  <div class="container mx-auto px-4 pt-24 pb-16 md:pt-32">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <Transition
        appear
        enter-active-class="transition duration-1000 ease-out"
        enter-from-class="opacity-0 -translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
      >
        <div v-show="showContent" class="text-left space-y-6 md:space-y-8">
          <h1 class="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
            Cursos, Tecnicos laborales y
            Diplomados Online <span class="text-orange-500">Certificados</span>
          </h1>
          <h2 class="text-xl md:text-2xl text-blue-900">
            Dale click a tu futuro <span class="text-orange-500">Profecional</span>
          </h2>
          <p class="text-gray-600 text-base md:text-lg">
            Cursos con certificados en: Mecanica Basica, Manejo defencivo, Curso de conducción, Renovacion de licencia.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#" class="bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 text-center transition duration-300">
              Programas Técnicos
            </a>
            <a href="#" class="bg-blue-400 text-white px-8 py-3 rounded-md hover:bg-blue-500 text-center transition duration-300">
              Cursos Certificados
            </a>
          </div>
          
        </div>
      </Transition>
              
      <Transition
        appear
        enter-active-class="transition duration-1000 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
      >
        <div v-show="showContent" class="block mt-8 lg:mt-0">
          <img 
            src="https://mitsubishi-motors.com.co/blog/wp-content/uploads/2021/01/consejos-de-mecanica-basica.jpg"
            alt="Mecánica Básica"
            class="w-full h-auto rounded-lg shadow-lg object-cover max-h-[500px]"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.transition {
  transition-property: all;
}
</style>
