<template>
  <Group ref="transform">
    <FbxModel
      :src="model"
      @load="onLoad"
    />
  </Group>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { BlockShaderMaterial } from '@/world/materials'

export default defineComponent({
  name: 'UserAgent',

  setup () {
    const transform = ref(null)
    const material = ref(new BlockShaderMaterial())

    onMounted(() => {
      transform.value = transform.value.group
    })

    return {
      transform,
      material
    }
  },

  data: () => ({
    model: import.meta.env.VITE_PUBLIC_URL + '/meshes/player.fbx'
  }),

  methods: {
    onLoad (mesh) {
      mesh.traverse(node => {
        if (!node.isMesh) return

        node.material.dispose()
        node.material = this.material
      })

      this.$emit('load', mesh)
    }
  }
})
</script>
