<template>
</template>

<script setup>
import { defineEmits, watch } from 'vue'
import { useGameplay, useInput } from '@/store'

const emit = defineEmits([
  'move'
])

const { isPaused } = useGameplay()
const { axis } = useInput()

watch(isPaused, value => {
  if (!value) return

  emit('move', { x: 0, y: 0 })
})

watch(axis.value, ({ x, y }) => {
  if (isPaused.value) return

  emit('move', { x, y })
})
</script>
