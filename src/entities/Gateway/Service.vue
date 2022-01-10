<template>
  <Group ref="transform" :position="position">
    <Text ref="text"
      :text="`:${port}`"
      :size=".25"
      :height="0"
      :font-src="font"
      @created="onLoadText"
      @click="onClick"
    >
      <BasicMaterial
        color="#ffff00"
        :props="{ opacity: .8, transparent: true, blending: 2 }"
      />
    </Text>

    <Box ref="box"
      :scale="{ x: .5, y: 2, z: .1 }"
      @click="onClick"
    >
      <BlockMaterial :displace="{ x: 0, y: 0, z: .05 }" />
    </Box>

    <Plane ref="screen"
      :scale="{ x: 0, y: 0, z: 1 }"
      :position="{ y: 2, z: .5 }"
      :rotation="{ x: -Math.PI / 8 }"
      @click="onClick"
    >
      <ProjectionMaterial />
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
    }
  },

  watch: {
    isActive (value) {
      const { screen } = this.$refs

      anime({
        targets: screen.mesh.scale,
        x: value ? 2.5 : 0,
        y: value ? 1.5 : 0,
        duration: 300,
        easing: value ? 'easeInQuad' : 'easeOutQuad'
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
      mesh.position.y = .5
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
