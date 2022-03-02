<template>
  <Box :scale="scale" :position="position">
  </Box>
</template>

<script setup>
import { ref } from 'vue'

const position = ref({ x: 0, y: 1, z: 0 })
const scale = ref({ x: .5, y: 1, z: .1 })

</script>
