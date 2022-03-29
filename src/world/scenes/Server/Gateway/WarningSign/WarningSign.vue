<template>
  <Group v-bind="$attrs" ref="root">
    <Plane :width="3" :height=".1" :position="{ y: -.3 }">
      <StripesMaterial color="#ffaa00" :fade=".75" />
    </Plane>

    <Plane :position="{ y: 1 }" :scale="{ x: .75, y: .75, z: .75 }">
      <ProjectionMaterial
        :texture="thumbnail"
        color="#ff0000"
      />
    </Plane>

    <Text
      text="401 Unauthorized"
      :font-src="font"
      :size=".3"
      :height="0"
      @created="onLoadText"
    >
      <BasicMaterial
        color="#ff6600"
        :props="{ blending: 2, transparent: true }"
      />
    </Text>

    <Plane :width="3" :height=".1" :position="{ y: .3 }">
      <StripesMaterial color="#ffaa00" :fade=".75" />
    </Plane>
  </Group>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue'
import font from '@/assets/fonts/Bayon.json?url'
import thumbnail from './warning-sign.png?url'

const root = ref(null)
const transform = computed(() => root.value.group)

const onLoadText = (mesh) => {
  mesh.geometry.computeBoundingBox()

  const boundingBox = mesh.geometry.boundingBox
  const width = boundingBox.max.x - boundingBox.min.x
  const height = boundingBox.max.y - boundingBox.min.y

  mesh.position.x -= width / 2
  mesh.position.y -= height / 2
}

defineExpose({
  transform
})
</script>
