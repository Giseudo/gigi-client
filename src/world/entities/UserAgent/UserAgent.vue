<template>
  <Group ref="root">
    <FbxModel
      :src="userAgentModel"
      @load="onLoad"
    />

    <NavmeshMovement ref="movement" :speed="4" />
    <PlayerController ref="controller" @move="movement?.move" />
  </Group>
</template>

<script>
import { defineComponent, ref, computed, provide } from 'vue'
import { BlockShaderMaterial } from '@/world/materials'
import { PlayerController, NavmeshMovement } from '@/world/components'
import { MeshInjectionKey } from 'troisjs'
import userAgentModel from './user-request-model.fbx?url'

export default defineComponent({
  name: 'UserAgent',

  emits: [ 'load' ],

  components: {
    NavmeshMovement,
    PlayerController,
  },

  setup (_, { emit }) {
    const root = ref(null)
    const model = ref(null)
    const movement = ref(null)
    const controller = ref(null)
    const transform = computed(() => root.value?.group)
    const material = ref(new BlockShaderMaterial())

    const onLoad = (mesh) => {
      mesh.traverse(node => {
        if (!node.isMesh) return

        node.material.dispose()
        node.material = material.value
      })

      emit('load', mesh)
    }

    provide(MeshInjectionKey, transform)

    return {
      root,
      model,
      transform,
      movement,
      controller,
      userAgentModel,
      onLoad,
    }
  },
})
</script>
