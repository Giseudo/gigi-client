<template>
  <Ring ref="path"
    :outer-radius="radius"
    :inner-radius="radius - 1"
    :theta-segments="64"
    :phi-segments="1"
    :rotation="{ x: -Math.PI / 2, y: 0, z: 0 }"
  >
    <ShaderMaterial :props="pathMaterialProps" />
  </Ring>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { Vector3, RingBufferGeometry } from 'three'
import fragmentShader from './PathFrag.glsl?raw'
import vertexShader from './PathVert.glsl?raw'

const path = ref(null)
const geo = new RingBufferGeometry(3, 5, 64)
const pos = geo.attributes.position
const v3 = new Vector3()

onMounted(() => {
  for (let i = 0; i < pos.count; i++){
    v3.fromBufferAttribute(pos, i)
    path.value.mesh.geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1)
  }
})

const pathMaterialProps = {
  fragmentShader,
  vertexShader,
  transparent: true,
  depthWrite: false,
  blending: 2,
  uniforms: { uTime: time }
}

defineProps({
  radius: {
    type: Number,
    default: 5
  }
})
</script>
