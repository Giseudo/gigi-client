<template>
  <Group v-bind="$attrs" ref="root">
    <FbxModel
      :src="metroGateModel"
      @load="onLoadModel"
    />
    <Box
      :scale="{ x: 1, y : .5, z: 1 }"
      :position="{ x: .4, y: .25, z: .1 }"
    >
      <BasicMaterial
        :props="{ transparent: true, opacity: 0 }"
      />
    </Box>
  </Group>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { TextureLoader, MeshBasicMaterial, NearestFilter } from 'three'
import { BlockShaderMaterial } from '@/world/materials'
import { useInteraction } from '@/store'
import { metroGateModel } from './'
import metroGatePanelIn from './metro-gate-panel-in.png?url'
import metroGatePanelOut from './metro-gate-panel-out.png?url'
import anime from 'animejs'

const DIRECTIONS = [ 'in', 'out' ]

export default defineComponent({
  name: 'MetroGate',

  emits: [ 'interact' ],

  setup (props, { emit }) {
    const { createInteraction } = useInteraction()

    const root = ref(null)
    const model = ref(null)
    const transform = computed(() => root.value?.group)
    const isOpened = ref(false)
    const blockMaterial = new BlockShaderMaterial({ color: '#363638' })

    const onInteract = (moveTo = false) => emit('interact', moveTo)

    createInteraction('metro-gate', 'Access', transform, 2, onInteract)

    const onLoadModel = async (loadedModel) => {
      const loader = new TextureLoader()
      const image = props.direction === 'in' ?
        metroGatePanelIn : metroGatePanelOut

      model.value = loadedModel

      loader.load(image, texture => {
        texture.magFilter = NearestFilter

        loadedModel.traverse((node) => {
          if (node.name === 'Gate')
            root.value = node

          if (node.type === 'Mesh') {
            if (Array.isArray(node.material)) {
              node.material.forEach((material, index) => {
                if (material.name === 'MetroGate') {
                  node.material[index] = new MeshBasicMaterial({
                    map: texture
                  })

                  return
                }

                node.material[index].dispose()
                node.material[index] = blockMaterial
              })

              return
            }

            node.material.dispose()
            node.material = blockMaterial
          }
        })
      })
    }
  
    const doors = computed(() =>
      model.value?.children.filter(node =>
        [ 'MetroGateDoor_L', 'MetroGateDoor_R' ].includes(node.name)
      ) || []
    )

    const open = () => {
      const rotations = doors.value.map(node => node.rotation)

      anime({
        targets: rotations,
        y: props.direction === 'in' ? Math.PI / 2 : -Math.PI / 2,
        duration: 1000,
        easing: 'easeInOutQuad'
      })

      isOpened.value = true
    }

    const close = () => {
      const rotations = doors.value.map(node => node.rotation)

      anime({
        targets: rotations,
        y: 0,
        duration: 1000,
        easing: 'easeInOutQuad'
      })

      isOpened.value = false
    }

    return {
      root,
      transform,
      model,
      metroGateModel,
      onLoadModel,
      open,
      close,
      onInteract,
    }
  },

  props: {
    direction: {
      type: String,
      default: 'in',
      validate: (value) => DIRECTIONS.includes(value)
    }
  }
})
</script>
