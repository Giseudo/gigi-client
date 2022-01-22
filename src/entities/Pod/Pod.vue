<template>
  <Group ref="transform">
    <FbxModel
      :src="podModel"
      @load="onLoadModel"
    />
  </Group>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { PodFaceShaderMaterial } from './'
import { BlockShaderMaterial } from '@/materials'
import podModel from './pod-model.fbx?url'
import podFace from './pod-face-sdf.png?url'

export default defineComponent({
  name: 'Pod',

  setup () {
    const transform = ref(null)
    const bodyMaterial = ref(new BlockShaderMaterial({
      displace: { x: 0, y: 0, z: 0 }
    }))
    const faceMaterial = ref(new PodFaceShaderMaterial({
      faceTexture: podFace
    }))

    onMounted(() => {
      transform.value = transform.value.group
    })

    return {
      transform,
      bodyMaterial,
      podModel,
      faceMaterial
    }
  },

  methods: {
    onLoadModel (model) {
      model.traverse(node => {
        if (!node.isMesh) return

        if (node.name === 'PodFace')
          node.material = this.faceMaterial

        if (node.name === 'PodBody')
          node.material = this.bodyMaterial
      })

      this.$emit('load', model)
    },
  }
})
</script>
