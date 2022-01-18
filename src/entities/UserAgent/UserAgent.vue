<template>
  <Group ref="transform">
    <FbxModel
      src="/meshes/player.fbx"
      @load="onLoad"
    />
  </Group>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { BlockShaderMaterial } from '@/materials'

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
