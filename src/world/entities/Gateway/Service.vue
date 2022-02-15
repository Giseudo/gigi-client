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
          :props="{ blending: 2, transparent: true }"
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

    <Group ref="screen"
      :scale="{ x: 0, y: .02, z: 1 }"
      :position="{ y: 3.5, z: .5 }"
      :rotation="{ x: -Math.PI / 8 }"
    >
      <Spinner :scale="{ x: 2.5, y: 2.5 }" :is-loading="isLoading" />

      <Plane :position="{ z: -.01 }" :scale="{ x: 4, y: 3 }" @click="onClick">
        <ProjectionMaterial ref="screenMaterial" :texture="thumbnail" />
      </Plane>
    </Group>
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { BlockMaterial, ProjectionMaterial } from '@/world/materials'
import { useGatewayService } from '@/services'
import { Spinner } from '@/world/components/Spinner'
import font from '@/assets/fonts/V5XtenderRegular.font?url'
import anime from 'animejs'

export default defineComponent({
  name: 'Service',

  emits: [ 'click' ],

  components: {
    ProjectionMaterial,
    BlockMaterial,
    Spinner,
  },
  
  setup () {
    const { activePort } = useGatewayService()
    const transform = ref(null)

    return {
      transform,
      activePort,
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
    activePort () {
      this.animate()
    }
  },

  data: () => ({
    font,
    isLoading: true,
    direction: { x: 0, y: 0, z: 0 },
  }),

  methods: {
    init () {
      const forward = new Vector3(0, 0, -1)

      this.direction = this.transform.group.getWorldDirection(forward)

    },

    animate () {
      const value = this.activePort === this.port
      const { screen, text, screenMaterial } = this.$refs
      const { uFade } = screenMaterial.materialProps.uniforms
      const width = { x: value ? 1 : 0 }
      const height = { y: value ? 1 : .02 }
      const easing = value ? 'easeInQuad' : 'easeOutQuad'

      uFade.value = 1.

      anime.timeline({
        targets: screen.group.scale,
        duration: 150,
        easing
      })
        .add(value ? width : height)
        .add(value ? height : width)

      anime({
        targets: uFade,
        value: 0.,
        delay: 500,
        duration: 150,
        easing: 'linear',
      })

      anime({
        targets: text.group.position,
        y: value ? .75 : .5,
        z: value ? 1. : .25,
        duration: 300,
        easing,
      })

      anime({
        targets: text.group.scale,
        x: value ? 2. : 1.,
        y: value ? 2. : 1.,
        z: value ? 2. : 1.,
        duration: 300,
        easing,
        complete: () => this.isLoading = !value
      })

    },

    onLoadText (mesh) {
      mesh.geometry.computeBoundingBox()

      const boundingBox = mesh.geometry.boundingBox
      const width = boundingBox.max.x - boundingBox.min.x

      mesh.position.x -= width / 2
      mesh.position.z = .25

      this.init()
    },

    onClick () {
      if (this.activePort !== this.port) return

      this.$emit('click')
    }
  }
})
</script>
