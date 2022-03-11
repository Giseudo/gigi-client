<template>
  <Group ref="transform" :position="position">
    <FbxModel
      :src="gatekeeperModel"
      @load="onLoadModel"
    />

    <Sphere
      ref="sphere"
      :scale="{ x: 1, y: 1, z: 1 }"
      @click="onClick"
    >
      <BasicMaterial
        :props="{
          transparent: true,
          depthWrite: false,
          opacity: 0
        }"
      />
    </Sphere>
  </Group>
</template>

<script>
import { Vector3 } from 'three'
import { defineComponent, ref, onMounted } from 'vue'
import { PodFaceShaderMaterial } from '@/world/entities/Pod'
import { BlockShaderMaterial } from '@/world/materials'
import { useInteraction } from '@/store'
import gatekeeperModel from './gatekeeper-model.fbx?url'
import gatekeeperFace from './gatekeeper-face.png?url'

export default defineComponent({
  name: 'Gatekeeper',

  setup (_, { emit }) {
    const { createInteraction } = useInteraction()
    const transform = ref(null)
    const bodyMaterial = ref(new BlockShaderMaterial({ displace: { x: 0, y: 0, z: 0 } }))
    const faceMaterial = ref(new PodFaceShaderMaterial({ faceTexture: gatekeeperFace }))

    onMounted(() => {
      transform.value = transform.value.group

      createInteraction('gatekeeper', 'Talk', transform.value, 2)
    })

    const onLoadModel = (model) => {
      model.traverse(node => {
        if (!node.isMesh) return

        if (node.name === 'GatekeeperFace')
          node.material = faceMaterial.value

        if (node.name === 'GatekeeperBody')
          node.material = bodyMaterial.value
      })

      emit('load', model)
    }

    const onClick = () => emit('click')

    return {
      transform,
      gatekeeperModel,
      bodyMaterial,
      faceMaterial,
      onLoadModel,
      onClick
    }
  },

  props: {
    position: {
      type: [ Object, Vector3 ],
      default: () => ({ x: 0, y: 0, z: 0 })
    }
  },
})
</script>
