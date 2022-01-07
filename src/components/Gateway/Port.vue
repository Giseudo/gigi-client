<template>
  <Group ref="transform" :position="position" :scale="{ x: .5, y: .5, z: .5 }">
    <Text
      :text="`:${number}`"
      :size=".75"
      :height="0"
      :font-src="font"
      @created="onLoadText"
    >
      <BasicMaterial
        color="#ff0000"
        :props="{ opacity, transparent: true }"
      />
    </Text>

    <Ring
      :theta-segments="24"
      :inner-radius="1.2"
      :outer-radius="1.25"
      :position="{ x: 0, y: 0, z: -.3 }"
      @click="$emit('click')"
    >
      <BasicMaterial
        color="#ff0000"
        :props="{ opacity, transparent: true, side: 2 }"
      />
    </Ring>

    <Circle
      v-if="!isDisabled"
      :radius="1"
      :segments="24"
      :position="{ x: 0, y: 0, z: -.2 }"
      @pointer-enter="onPointerEnter"
      @pointer-leave="onPointerLeave"
      @click="onClick"
    >
      <BasicMaterial
        color="#ff0000"
        :props="{ opacity: circleOpacity, transparent: true, side: 2 }"
      />
    </Circle>

    <Octahedron
      ref="pyramid"
      :scale="{ x: .2, y: .2, z: .2 }"
      :position="{ x: 0, y: 0, z: -.6 }"
    >
      <MatcapMaterial
        color="#ffffff"
      />
    </Octahedron>
  </Group>
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3 } from 'three'
import { useGateway } from './'
import anime from 'animejs'

export default defineComponent({
  name: 'Port',

  setup () {
    const { activePort } = useGateway()

    return {
      activePort
    }
  },

  props: {
    position: {
      type: [ Object, Vector3 ],
      default: () => ({ x: 0, y: 0, z: 0 })
    },

    number: {
      type: Number,
      detaul: 80
    },

    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    activePort (value) {
      if (this.isDisabled) return

      const active = value === this.number
      const { transform, pyramid } = this.$refs

      anime({
        targets: transform.group.scale,
        x: active ? 1 : .5,
        y: active ? 1 : .5,
        z: active ? 1 : .5,
        easing: 'easeOutQuad',
        duration: 500
      })

      anime({
        targets: pyramid.mesh.position,
        z: active ? 1 : -.75,
        easing: 'easeOutQuad',
        duration: 1000
      })
      
      anime({
        targets: pyramid.mesh.scale,
        x: active ? .75 : .2,
        y: active ? .75 : .2,
        z: active ? .75 : .2,
        easing: 'easeOutQuad',
        duration: 1000
      })
    }
  },

  computed: {
    opacity () {
      return this.isDisabled ? .2 : .75
    },
  },

  data: () => ({
    font: require('@/assets/fonts/V5XtenderRegular.font').default,
    circleOpacity: .2,
    test: false
  }),

  methods: {
    onLoadText (mesh) {
      mesh.geometry.computeBoundingBox()

      const boundingBox = mesh.geometry.boundingBox
      const width = boundingBox.max.x - boundingBox.min.x
      const height = boundingBox.max.y - boundingBox.min.y

      mesh.position.x -= width / 2
      mesh.position.y -= height / 2
    },

    async onClick () {
      if (this.isDisabled) return

      this.$emit('click')
    },

    onPointerEnter () {
      if (this.isDisabled) return

      anime({
        targets: this,
        circleOpacity: .4,
        easing: 'easeOutQuad',
        duration: 100
      })
    },

    onPointerLeave () {
      if (this.isDisabled) return

      anime({
        targets: this,
        circleOpacity: .2,
        easing: 'easeOutQuad',
        duration: 100
      })
    }
  }
})
</script>
