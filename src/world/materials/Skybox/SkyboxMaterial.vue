<template>
  <ShaderMaterial :props="props" />
</template>

<script>
import { defineComponent } from 'vue'
import fragmentShader from './SkyboxFrag.glsl?raw'
import vertexShader from './SkyboxVert.glsl?raw'

export default defineComponent({
  data: () => ({
    props: {
      fragmentShader,
      vertexShader,
      side: 1
    }
  })
})
</script>
