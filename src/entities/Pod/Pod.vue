<template>
  <Group ref="transform" :position="position">
    <FbxModel
      :src="podModel"
      @load="onLoadModel"
    />
    <Sphere
      ref="sphere"
      :scale="{ x: .1, y: .1, z: .1 }"
      @click="$emit('click')"
    >
      <BasicMaterial :props="{ transparent: true, depthWrite: false, opacity: 0 }" />
    </Sphere>
  </Group>
</template>

<script>
import { Vector3 } from 'three'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { PodFaceShaderMaterial } from './'
import { BlockShaderMaterial } from '@/materials'
import podModel from './pod-model.fbx?url'
import podFace from './pod-face-sdf.png?url'
import { initEntity } from '@/components/entitySetup'

export default defineComponent({
  name: 'Pod',

  setup (props) {
    const { transform, update, moveTo, lookAt, positionOffset, lookAtOffset } = initEntity(props)
    const bodyMaterial = ref(new BlockShaderMaterial({ displace: { x: 0, y: 0, z: 0 } }))
    const faceMaterial = ref(new PodFaceShaderMaterial({ faceTexture: podFace }))

    update(time => {
      const t = (Math.cos(time) + 1) / 2

      positionOffset.y = t * .005
      lookAtOffset.y = t * .15
    })

    return {
      transform,
      podModel,
      bodyMaterial,
      moveTo,
      lookAt,
      update,
      faceMaterial
    }
  },

  props: {
    speed: {
      type: Number,
      default: 2
    },

    position: {
      type: [ Object, Vector3 ],
      default: () => ({ x: 0, y: 0, z: 0 })
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
