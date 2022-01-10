<template>
  <PointLight :position="{ y: 50, z: 50 }" />

  <Box ref="boxes"
    v-for="box in boxCount"
    :scale="{ x: .05, y: .05, z: .05 }"
    :key="box"
    @pointer-enter="onGrow"
    @pointer-leave="onShrink"
    @click="onSelect"
  >
    <PhysicalMaterial />
  </Box>

  <Sphere
    :scale="{ x: .025, y: .025, z: .025 }"
    :height-segments="6"
    :width-segments="6"
  >
    <MatcapMaterial />
  </Sphere>
</template>

<script>
import { defineComponent } from 'vue'
import { useGame, usePointer } from '../store'
import { Vector3 } from 'three'
import anime from 'animejs'

export default defineComponent({
  setup () {
    return {
      ...useGame(),
      ...usePointer()
    }
  },
  
  data: () => ({
    boxCount: 18,
    active: null
  }),

  mounted () {
    const { boxes } = this.$refs
    const r = 360 / this.boxCount

    this.camera.position.set(0, 0, 0)
    this.camera.lookAt(new Vector3())

    anime({
      targets: this.camera.position,
      z: 1,
      y: 0,
      x: 0,
      duration: 1000,
      easing: 'easeOutQuad'
    })

    boxes.forEach(({ mesh }, i) => {
      const t = Math.radians(r * i)

      mesh.rotation.y = i

      anime({
        targets: mesh.position,
        x: Math.radians(r) * Math.cos(t),
        y: Math.radians(r) * Math.sin(t),
        easing: 'easeInQuad',
        delay: i * 2,
        duration: 500
      })
    })

    this.renderer.onBeforeRender(() =>
      boxes.forEach(({ mesh }) => {
        mesh.rotation.y += this.deltaTime
      })
    )
  },

  methods: {
    onGrow (event) {
      const { mesh } = event.component

      this.setCursor('pointer')

      if (this.active === mesh.uuid) return

      anime({
        targets: mesh.scale,
        x: .075,
        y: .075,
        z: .075,
        easing: 'easeOutElastic(1, .1)',
        duration: 200
      })
    },

    onShrink (event) {
      const { mesh } = event.component

      this.setCursor('initial')

      if (this.active === mesh.uuid) return

      anime({
        targets: mesh.scale,
        x: .05,
        y: .05,
        z: .05,
        easing: 'easeInQuad',
        duration: 200
      })
    },

    onSelect (event) {
      const { mesh } = event.component
      const { boxes } = this.$refs
      const r = 360 / this.boxCount

      boxes.forEach(({ mesh }, i) => {
        const t = Math.radians(r * i)

        anime({
          targets: mesh.position,
          x: Math.radians(r) * Math.cos(t),
          y: Math.radians(r) * Math.sin(t),
          easing: 'easeInQuad',
          duration: 200
        })

        anime({
          targets: mesh.scale,
          x: .05,
          y: .05,
          z: .05,
          easing: 'easeInQuad',
          duration: 200
        })
      })

      if (this.active === mesh.uuid) {
        this.active = null

        return
      }

      this.active = mesh.uuid

      anime({
        targets: mesh.scale,
        x: .4,
        y: .4,
        z: .4,
        easing: 'easeInQuad',
        duration: 200
      })

      anime({
        targets: mesh.position,
        x: 0,
        y: 0,
        z: 0,
        easing: 'easeInQuad',
        duration: 200
      })
    }
  }
})
</script>
