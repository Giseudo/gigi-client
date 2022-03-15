<template>
  <Box :scale="scale" :position="position" ref="root">
    <BlockMaterial :displace="displace" />
  </Box>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue'

const position = { x: 0, y: 1, z: 0 }
const scale = { x: .25, y: .75, z: .05 }
const displace = { x: 0, y: 0, z: .02 }
const root = ref(null)
const transform = computed(() => root.value.mesh)

defineExpose({
  transform
})
</script>
