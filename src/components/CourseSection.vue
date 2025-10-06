<template>
  <div class="w-full">
    <button 
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors rounded-lg shadow-sm mb-2"
    >
      <div class="flex items-center">
        <img :src="icon" :alt="title" class="w-8 h-8 mr-3">
        <span class="text-lg font-medium text-gray-900">{{ title }}</span>
      </div>
      <svg 
        class="w-5 h-5 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="isOpen" class="bg-white p-4 rounded-lg shadow-sm mb-4">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
  icon: string;
}>();

const isOpen = ref(false);
</script>