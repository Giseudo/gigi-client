<template>
  <Octahedron
    v-if="!isDisabled"
    ref="pyramid"
    :scale="{ x: .2, y: .2, z: .2 }"
    :position="{ x: 0, y: 0, z: -.75 }"
  >
    <MatcapMaterial
      color="#ffffff"
    />
  </Octahedron>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Ship',
})
</script>
