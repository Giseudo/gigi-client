<template>
  <Group ref="transform" :position="position">
    <Group ref="text" :position="{ y: .5 }">
      <Text
        :text="`:${port}`"
        :size=".3"
        :height="0"
        :font-src="font"
        @created="onLoadText"
        @click="onClick"
      >
        <BasicMaterial
          color="#ffff00"
        />
      </Text>
    </Group>

    <Box ref="box"
      :position="{ y: 0 }"
      :scale="{ x: .75, y: 3, z: .1 }"
      @click="onClick"
    >
      <BlockMaterial :displace="{ x: 0, y: 0, z: .05 }" />
    </Box>

    <Plane ref="screen"
      :scale="{ x: 0, y: .02, z: 1 }"
      :position="{ y: 3.5, z: .5 }"
      :rotation="{ x: -Math.PI / 8 }"
      @click="onClick"
    >
      <ProjectionMaterial :texture="thumbnail" />
    </Plane>
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { BlockMaterial, ProjectionMaterial } from '@/materials'
import { useNavigator, useGame } from '@/store'
import anime from 'animejs'

export default defineComponent({
  name: 'Service',

  emits: [ 'click', 'toggle' ],

  components: {
    ProjectionMaterial,
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
    },

    thumbnail: {
      type: String,
      default: '/images/megaman-legends.jpg'
    }
  },

  watch: {
    isActive (value) {
      const { screen, text } = this.$refs

      const width = { x: value ? 4 : 0 }
      const height = { y: value ? 3 : .02 }
      const scale = value ? 2. : 1.
      const easing = value ? 'easeInQuad' : 'easeOutQuad'

      anime.timeline({
        targets: screen.mesh.scale,
        duration: 150,
        easing
      })
        .add(value ? width : height)
        .add(value ? height : width)

      anime({
        targets: text.group.position,
        y: value ? 1. : .5,
        z: value ? .5 : .25,
        duration: 200,
        easing
      })

      anime({
        targets: text.group.scale,
        x: scale,
        y: scale,
        z: scale,
        duration: 200,
        easing
      })

      this.$emit('toggle', { active: value, port: this.port })
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
    init () {
      const forward = new Vector3(0, 0, -1)

      this.direction = this.transform.group.getWorldDirection(forward)

      this.subscribe('user-move', this.onUserMove)
    },

    onLoadText (mesh) {
      mesh.geometry.computeBoundingBox()

      const boundingBox = mesh.geometry.boundingBox
      const width = boundingBox.max.x - boundingBox.min.x

      mesh.position.x -= width / 2
      mesh.position.z = .25

      this.init()
    },

    onUserMove ({ message: userPosition }) {
      const userDirection = userPosition.clone()
        .sub(this.transform.group.position)
        .normalize()
      const inFrontOf = userDirection.dot(this.direction) > .5

      this.isActive = inFrontOf
    },

    onClick () {
      if (!this.isActive) return

      this.$emit('click')
    }
  }
})
</script>
