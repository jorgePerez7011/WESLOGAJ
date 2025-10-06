<template>
  <div class="fixed top-4 left-4 z-50">
    <transition-group name="float">
      <div
        v-for="announcement in visibleAnnouncements"
        :key="announcement.id"
        class="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500 w-[300px] mb-4 transform transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-gray-800">{{ announcement.title }}</h3>
          <button
            @click="dismissAnnouncement()"
            class="text-gray-400 hover:text-gray-600"
          >
            <span class="sr-only">Cerrar</span>
            ×
          </button>
        </div>
        <p class="text-sm text-gray-600 mt-1">{{ announcement.message }}</p>
        <!-- Barra de progreso -->
        <div class="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 transition-all duration-300 ease-linear"
            :style="{ width: `${getProgressWidth(announcement)}%` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Announcement {
  id: number;
  title: string;
  message: string;
  timestamp?: number;
}

const DISPLAY_TIME = 7000; // 7 segundos
const visibleAnnouncements = ref<Announcement[]>([]);
let currentIndex = 0;

const props = defineProps<{
  initialAnnouncements: Announcement[]
}>();

const showNextAnnouncement = () => {
  // Limpiar cualquier anuncio anterior
  visibleAnnouncements.value = [];

  // Si no hay anuncios, no hacer nada
  if (!props.initialAnnouncements || props.initialAnnouncements.length === 0) {
    return;
  }

  // Reiniciar si llegamos al final
  if (currentIndex >= props.initialAnnouncements.length) {
    currentIndex = 0;
  }

  const newAnnouncement = {
    ...props.initialAnnouncements[currentIndex],
    timestamp: Date.now()
  };

  // Mostrar el nuevo anuncio
  visibleAnnouncements.value = [newAnnouncement];
  currentIndex++;

  // Programar la eliminación y el siguiente anuncio
  setTimeout(() => {
    visibleAnnouncements.value = [];
    setTimeout(() => {
      showNextAnnouncement();
    }, 500); // Pequeña pausa entre anuncios
  }, DISPLAY_TIME);
};

const dismissAnnouncement = () => {
  visibleAnnouncements.value = [];
  // Mostrar el siguiente anuncio después de una pequeña pausa
  setTimeout(showNextAnnouncement, 500);
};

const getProgressWidth = (announcement: Announcement): number => {
  const elapsed = Date.now() - (announcement.timestamp || Date.now());
  const progress = 100 - (elapsed / DISPLAY_TIME) * 100;
  return Math.max(0, Math.min(100, progress));
};

onMounted(() => {
  // Iniciar el ciclo de anuncios cuando el componente se monte
  if (props.initialAnnouncements && props.initialAnnouncements.length > 0) {
    showNextAnnouncement();
  }
});
</script>

<style scoped>
.float-enter-active,
.float-leave-active {
  transition: all 0.5s ease;
}

.float-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.float-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.float-move {
  transition: transform 0.5s ease;
}
</style>
