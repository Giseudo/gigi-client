<template>
  <Group v-bind="$attrs" ref="root">
    <Box
      :scale="{ x: .5, y : .5, z: .5 }"
      @click="onInteract"
    />

    <RouterRoute>
    </RouterRoute>
  </Group>
</template>

<script setup>
import { ref, defineExpose, defineEmits, computed } from 'vue'
import { useInteraction } from '@/store'
import RouterRoute from './RouterRoute.vue'

const root = ref(null)
const transform = computed(() => root.value?.group)

const { createInteraction } = useInteraction()
const emit = defineEmits([ 'interact' ])

const onInteract = () => emit('interact', transform.value)

createInteraction('router-panel', 'Access', transform, 2, onInteract)

defineExpose({
  root,
  transform
})
</script>
