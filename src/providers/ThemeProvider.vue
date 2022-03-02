<template>
  <slot></slot>
</template>

<script setup>
import { defineProps, provide, computed } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'light',
    validate: (value) => [ 'dark', 'ligth' ].includes(value)
  }
})

const theme = computed(() => props.theme)

provide('theme', theme)
</script>
