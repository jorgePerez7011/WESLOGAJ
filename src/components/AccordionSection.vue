<!-- AccordionSection.vue -->
<template>
  <div class="border-b border-gray-200 last:border-b-0">
    <button
      class="w-full py-4 px-6 flex items-center justify-between hover:bg-gray-50 focus:outline-none"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center">
        <div class="mr-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full" :class="[isOpen ? 'bg-blue-500' : 'bg-gray-200']">
          <slot name="icon"></slot>
        </div>
        <div class="text-left">
          <h3 class="text-lg font-semibold text-gray-900">
            <slot name="title"></slot>
          </h3>
          <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
        </div>
      </div>
      <svg
        class="w-6 h-6 transform transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-show="isOpen"
      class="px-6 pb-4"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  subtitle: String
})

const isOpen = ref(false)
</script>
