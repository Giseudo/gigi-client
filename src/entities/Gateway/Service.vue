<template>
  <Group ref="transform" :position="position">
    <Text ref="text"
      :text="`:${port}`"
      :size=".25"
      :height="0"
      :font-src="font"
      @created="onLoadText"
    >
      <BasicMaterial
        color="#00ff00"
        :props="{ opacity: .8, transparent: true }"
      />
    </Text>

    <Box ref="box" :scale="{ x: .5, y: 2, z: .05 }" >
      <BlockMaterial />
    </Box>
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { BlockMaterial } from '@/materials'
import { useNavigator, useGame } from '@/store'
import anime from 'animejs'

export default defineComponent({
  name: 'Service',

  components: {
    BlockMaterial
  },
  
  setup () {
    const { userAgent, subscribe, unsubscribe } = useNavigator()
    const { renderer } = useGame()
    const transform = ref(null)

    return {
      subscribe,
      unsubscribe,
      transform,
      userAgent,
      renderer
    }
  },

  props: {
    port: {
      type: Number,
      default: 7000
    },

    position: {
      type: [ Vector3, Object ],
      default: () => ({ x: 0, y: 0, z: 0 })
    }
  },

  watch: {
    isActive (value) {
      const { text } = this.$refs

      anime({
        targets: text.mesh.position,
        y: value ? -.25 : .5,
        duration: 300,
        easing: 'easeOutQuad'
      })
    }
  },

  data: () => ({
    isActive: false,
    direction: { x: 0, y: 0, z: 0 },
    font: require('@/assets/fonts/V5XtenderRegular.font').default
  }),

  unmounted () {
    this.unsubscribe('user-move', this.onUserMove)
  },

  methods: {
    onLoadText (mesh) {
      mesh.geometry.computeBoundingBox()

      const boundingBox = mesh.geometry.boundingBox
      const width = boundingBox.max.x - boundingBox.min.x

      mesh.position.x -= width / 2
      mesh.position.y = .5
      mesh.position.z = .25

      this.init()
    },

    init () {
      const forward = new Vector3(0, 0, -1)

      this.direction = this.transform.group.getWorldDirection(forward)

      this.subscribe('user-move', this.onUserMove)
    },

    onUserMove ({ message: userPosition }) {
      const userDirection = userPosition.clone()
        .sub(this.transform.group.position)
        .normalize()
      const inFrontOf = userDirection.dot(this.direction) > .5

      this.isActive = inFrontOf
    }
  }
})
</script>
