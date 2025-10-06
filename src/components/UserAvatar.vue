<!-- UserAvatar.vue -->
<template>
  <img 
    :src="imageUrl"
    :alt="user.name"
    class="rounded-full object-cover"
    :class="sizeClass"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const imageUrl = computed(() => {
  if (props.user.image_url) {
    return `http://localhost:3000${props.user.image_url}`
  }
  // Usar UI Avatars como fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user.name)}&background=0D8ABC&color=fff`
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  return sizes[props.size]
})
</script>
