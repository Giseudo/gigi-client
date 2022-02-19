<template>
  <Group v-bind="$attrs" ref="transform">
    <Box
      :scale="{ x: .5, y : .5, z: .5 }"
      @click="onInteract"
    />
  </Group>
</template>

<script setup>
import { ref, defineExpose, defineEmits, onMounted } from 'vue'
import { useInteraction } from '@/store'

const transform = ref(null)

const { createInteraction } = useInteraction()
const emit = defineEmits([ 'interact' ])

onMounted(() => {
  transform.value = transform.value.group
})

const onInteract = () => emit('interact', transform.value)

createInteraction('router-panel', 'Access', transform, 2, onInteract)

defineExpose({
  transform
})
</script>
