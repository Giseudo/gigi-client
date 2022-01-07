<template>
  <Gateway
    ref="gateway"
    :radius="3"
    @port-accessed="onAccessPort"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { useGame, usePointer, useWindow } from '@/store'
import Gateway from '@/components/Gateway'
import anime from 'animejs'

export default defineComponent({
  name: 'Cloud',

  components: {
    Gateway
  },

  setup () {
    return {
      ...useGame(),
      ...usePointer(),
      ...useWindow(),
    }
  },

  computed: {
    speed () {
      return this.isMobile ? .05 : .2
    }
  },

  data: () => ({
    isDragging: false,
    delta: { x: 0, y: 0 },
    activeGate: null,
    material: null
  }),

  mounted () {
    this.camera.position.z = this.isMobile ? 15 : 8

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
    onPointerDown () {
      this.isDragging = true
    },

    onPointerMove ({ message }) {
      if (!this.isDragging) return

      const { gateway } = this.$refs

      this.delta = {
        x: message.movementY * this.deltaTime * this.speed,
        y: message.movementX * this.deltaTime * this.speed
      }
 
      if (Math.abs(gateway.transform.rotation.x + this.delta.x) < Math.PI / 3)
        gateway.transform.rotation.x += this.delta.x

      gateway.transform.rotation.y += this.delta.y
    },

    onPointerUp () {
      const { gateway } = this.$refs

      this.isDragging = false

      let t = 1

      const animate = () => {
        const step = Math.sin(t)
        t -= 0.05

        if (step <= 0 || this.isDragging) {
          this.delta = { x: 0, y: 0 }

          return window.cancelAnimationFrame(animate)
        }

        if (Math.abs(gateway.transform.rotation.x + this.delta.x) < Math.PI / 3)
          gateway.transform.rotation.x += this.delta.x * step

        gateway.transform.rotation.y += this.delta.y * step

        window.requestAnimationFrame(animate)
      }

      animate()
    },

    onAccessPort (port) {
      anime({
        targets: this.camera.position,
        z: !port ? (this.isMobile ? 15 : 8) : (this.isMobile ? 12 : 10),
        easing: 'easeOutQuad',
        duration: 1000,
      })
    }
  }
})
</script>
