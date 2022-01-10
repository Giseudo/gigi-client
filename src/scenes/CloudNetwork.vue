<template>
  <Server :radius="4" @port-access="onAccessPort" />
</template>

<script>
import { defineComponent } from 'vue'
import { useGame, useWindow } from '@/store'
import { Server } from '@/entities/Server'
import { Vector3 } from 'three'
import anime from 'animejs'

export default defineComponent({
  name: 'CloudNetwork',

  components: {
    Server
  },

  setup () {
    return {
      ...useGame(),
      ...useWindow(),
    }
  },

  mounted () {
    this.camera.position.set(0, 0, 40)
    this.camera.lookAt(new Vector3())

    anime({
      targets: this.camera.position,
      z: this.isMobile ? 14 : 12,
      duration: 2000,
      easing: 'easeOutQuad'
    })
  },

  methods: {
    onAccessPort (port) {
      anime({
        targets: this.camera.position,
        z: this.isMobile ? 18 : 14,
        easing: 'easeOutQuad',
        duration: 1000,
      })

      if (port === 443)
        anime({
          targets: this.camera.position,
          z: (this.isMobile ? 10 : 8),
          easing: 'easeInOutQuad',
          delay: 1000,
          duration: 3000,
          complete: () => this.$router.push({ name: 'InsideServer' })
        })
    }
  }
})
</script>
