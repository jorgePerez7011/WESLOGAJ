<!-- InscripcionesView.vue -->
<script setup lang="ts">
import { ref } from 'vue'

// Controla qué paso está abierto
const activeStep = ref<number | null>(null)

// Alterna entre abrir y cerrar un paso
const toggleStep = (index: number) => {
  activeStep.value = activeStep.value === index ? null : index
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-blue-900">Proceso de Inscripción</h1>
        <p class="mt-4 text-lg text-gray-600">
          Sigue estos pasos para inscribirte en nuestros programas educativos
        </p>
      </div>

      <div class="space-y-6">
        <!-- Sección de Pasos -->
        <div class="bg-white rounded-lg shadow overflow-hidden divide-y">
          <!-- Paso 1 -->
          <div>
            <button
              class="w-full flex justify-between items-center p-6 focus:outline-none hover:bg-blue-50 transition"
              @click="toggleStep(1)"
            >
              <h2 class="text-2xl font-semibold text-blue-800 text-left">
                1. Registro en la Plataforma
              </h2>
              <svg
                class="w-6 h-6 text-blue-700 transform transition-transform duration-300"
                :class="activeStep === 1 ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="accordion">
              <div
                v-show="activeStep === 1"
                class="px-6 pb-6 text-gray-600 overflow-hidden"
              >
                <p class="mt-2">
                  Para comenzar el proceso de inscripción, debes registrarte como estudiante en nuestra plataforma:
                </p>
                <ul class="mt-4 space-y-2 list-disc list-inside">
                  <li>Dirígete a la sección "Registro de Estudiante"</li>
                  <li>Completa el formulario con tus datos personales básicos</li>
                  <li>Asegúrate de usar un correo electrónico válido</li>
                  <li>Crea una contraseña segura</li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Paso 2 -->
          <div>
            <button
              class="w-full flex justify-between items-center p-6 focus:outline-none hover:bg-blue-50 transition"
              @click="toggleStep(2)"
            >
              <h2 class="text-2xl font-semibold text-blue-800 text-left">
                2. Documentación Requerida
              </h2>
              <svg
                class="w-6 h-6 text-blue-700 transform transition-transform duration-300"
                :class="activeStep === 2 ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="accordion">
              <div
                v-show="activeStep === 2"
                class="px-6 pb-6 text-gray-600 overflow-hidden"
              >
                <p class="mt-2">
                  Ten listos los siguientes documentos para completar tu inscripción:
                </p>
                <ul class="mt-4 space-y-2 list-disc list-inside">
                  <li>Documento de identidad (ambas caras)</li>
                  <li>Certificado de último grado de estudio</li>
                  <li>Fotografía tipo documento (fondo blanco)</li>
                  <li>Comprobante de domicilio reciente</li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Paso 3 -->
          <div>
            <button
              class="w-full flex justify-between items-center p-6 focus:outline-none hover:bg-blue-50 transition"
              @click="toggleStep(3)"
            >
              <h2 class="text-2xl font-semibold text-blue-800 text-left">
                3. Selección del Programa
              </h2>
              <svg
                class="w-6 h-6 text-blue-700 transform transition-transform duration-300"
                :class="activeStep === 3 ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="accordion">
              <div
                v-show="activeStep === 3"
                class="px-6 pb-6 text-gray-600 overflow-hidden"
              >
                <p class="mt-2">
                  Explora nuestro catálogo y elige el programa que más te interese:
                </p>
                <ul class="mt-4 space-y-2 list-disc list-inside">
                  <li>Revisa los requisitos específicos del programa</li>
                  <li>Verifica los horarios disponibles</li>
                  <li>Consulta la duración y modalidad del programa</li>
                  <li>Lee detenidamente el plan de estudios</li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Paso 4 -->
          <div>
            <button
              class="w-full flex justify-between items-center p-6 focus:outline-none hover:bg-blue-50 transition"
              @click="toggleStep(4)"
            >
              <h2 class="text-2xl font-semibold text-blue-800 text-left">
                4. Proceso de Pago
              </h2>
              <svg
                class="w-6 h-6 text-blue-700 transform transition-transform duration-300"
                :class="activeStep === 4 ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="accordion">
              <div
                v-show="activeStep === 4"
                class="px-6 pb-6 text-gray-600 overflow-hidden"
              >
                <p class="mt-2">Realiza el pago correspondiente a tu inscripción:</p>
                <ul class="mt-4 space-y-2 list-disc list-inside">
                  <li>Consulta el valor de la inscripción y matrícula</li>
                  <li>Elige tu método de pago preferido</li>
                  <li>Realiza el pago según las instrucciones proporcionadas</li>
                  <li>Guarda tu comprobante de pago</li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Paso 5 -->
          <div>
            <button
              class="w-full flex justify-between items-center p-6 focus:outline-none hover:bg-blue-50 transition"
              @click="toggleStep(5)"
            >
              <h2 class="text-2xl font-semibold text-blue-800 text-left">
                5. Confirmación y Bienvenida
              </h2>
              <svg
                class="w-6 h-6 text-blue-700 transform transition-transform duration-300"
                :class="activeStep === 5 ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="accordion">
              <div
                v-show="activeStep === 5"
                class="px-6 pb-6 text-gray-600 overflow-hidden"
              >
                <p class="mt-2">Una vez completado el proceso:</p>
                <ul class="mt-4 space-y-2 list-disc list-inside">
                  <li>Recibirás un correo de confirmación</li>
                  <li>Se te asignará un número de estudiante</li>
                  <li>Tendrás acceso a tu horario de clases</li>
                  <li>Podrás acceder a la plataforma educativa</li>
                </ul>
              </div>
            </transition>
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="bg-blue-50 p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-blue-800">Información Importante</h3>
          <ul class="mt-4 space-y-2 text-gray-600">
            <li>• El proceso de inscripción debe completarse en su totalidad para asegurar tu cupo</li>
            <li>• Los documentos deben ser legibles y estar vigentes</li>
            <li>• Para consultas adicionales, contáctanos a través de nuestros canales de atención</li>
          </ul>
        </div>

        <!-- Botón de Acción -->
        <div class="text-center mt-8">
          <router-link
            to="/registro/estudiante"
            class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Comenzar Inscripción
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: calc(100vh - 64px);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
