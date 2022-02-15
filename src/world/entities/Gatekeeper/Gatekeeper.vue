<template>
  <Group ref="transform" :position="position">
    <FbxModel
      :src="podModel"
      @load="onLoadModel"
    />
    <Sphere
      ref="sphere"
      :scale="{ x: 1, y: 1, z: 1 }"
      @click="onClick"
    >
      <BasicMaterial :props="{ transparent: true, depthWrite: false, opacity: 0 }" />
    </Sphere>
  </Group>
</template>

<script>
import { Vector3 } from 'three'
import { defineComponent, ref, onMounted } from 'vue'
import { PodFaceShaderMaterial } from '../Pod'
import { BlockShaderMaterial } from '@/world/materials'
import { useInteraction } from '@/store'
import podModel from '../Gatekeeper/gatekeeper.fbx?url'
import podFace from '../Pod/pod-face-sdf.png?url'

export default defineComponent({
  name: 'Gatekeeper',

  setup () {
    const transform = ref(null)
    const bodyMaterial = ref(new BlockShaderMaterial({ displace: { x: 0, y: 0, z: 0 } }))
    const faceMaterial = ref(new PodFaceShaderMaterial({ faceTexture: podFace }))
    const { createInteraction } = useInteraction()

    createInteraction('gatekeeper', 'Talk', transform, 2)
    onMounted(() => transform.value = transform.value.group)

    return {
      transform,
      podModel,
      bodyMaterial,
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

        if (node.name === 'GatekeeperFace')
          node.material = this.faceMaterial

        if (node.name === 'GatekeeperBody')
          node.material = this.bodyMaterial
      })

      this.$emit('load', model)
    },

    onClick () {
      this.$emit('click')
    }
  }
})
</script>
