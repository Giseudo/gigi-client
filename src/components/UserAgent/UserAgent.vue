<template>
  <Group ref="transform">
    <Box
      ref="pyramid"
      :position="{ y: 0.1 }"
      :scale="{ x: .2, y: .2, z: .2 }"
    >
      <BasicMaterial color="#ff0000" />
    </Box>
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UserAgent',

  setup () {
    const transform = ref(null)

    return {
      transform
    }
  }
})
</script>
