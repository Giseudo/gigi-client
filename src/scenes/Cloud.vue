<template>
  <PointLight :position="{ y: 50, z: 50 }" />

  <Dome ref="dome" @enter="onEnter" />
</template>

<script>
import { defineComponent } from 'vue'
import { useGame, usePointer, useWindow } from '@/store'
import Dome from '@/components/Dome'
import anime from 'animejs'

export default defineComponent({
  name: 'Cloud',

  components: {
    Dome
  },

  setup () {
    return {
      ...useGame(),
      ...usePointer(),
      ...useWindow(),
    }
  },

  data: () => ({
    isDragging: false,
    delta: { x: 0, y: 0 }
  }),

  mounted () {
    this.camera.position.z = this.isMobile ? 15 : 12
    console.log(this.isMobile)

    this.pointer.subscribe('pointer-down', this.onPointerDown)
    this.pointer.subscribe('pointer-move', this.onPointerMove)
    this.pointer.subscribe('pointer-up', this.onPointerUp)
  },

  unmounted () {
    this.pointer.unsubscribe('pointer-down', this.onPointerDown)
    this.pointer.unsubscribe('pointer-move', this.onPointerMove)
    this.pointer.unsubscribe('pointer-up', this.onPointerUp)
  },

  methods: {
    onEnter (port) {
      console.log('accessed port number', port)

      anime({
        targets: this.camera.position,
        z: this.isMobile ? 8 : 10,
        easing: 'easeOutQuad',
        duration: 1000
      })
    },

    onPointerDown () {
      this.isDragging = true
    },

    onPointerMove ({ message }) {
      if (!this.isDragging) return

      const { dome } = this.$refs

      this.delta = {
        x: message.movementY * this.deltaTime * .05,
        y: message.movementX * this.deltaTime * .05
      }
 
      if (Math.abs(dome.transform.rotation.x + this.delta.x) < Math.PI / 3)
        dome.transform.rotation.x += this.delta.x

      dome.transform.rotation.y += this.delta.y
    },

    onPointerUp () {
      const { dome } = this.$refs

      this.isDragging = false

      let t = 1

      const animate = () => {
        const step = Math.sin(t)
        t -= 0.05

        if (step <= 0 || this.isDragging) {
          this.delta = { x: 0, y: 0 }

          return window.cancelAnimationFrame(animate)
        }

        if (Math.abs(dome.transform.rotation.x + this.delta.x) < Math.PI / 3)
          dome.transform.rotation.x += this.delta.x * step

        dome.transform.rotation.y += this.delta.y * step

        window.requestAnimationFrame(animate)
      }

      animate()
    }
  }
})
</script>
