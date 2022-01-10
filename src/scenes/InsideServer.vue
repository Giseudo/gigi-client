<template>
  <Gateway
    :radius="radius"
    :services="services"
    @service-access="onAccessServer"
  />

  <UserAgent ref="user" />

  <GTouchStick @move="onTouchMove" />

  <Sphere :scale="{ x: 50, y: 50, z: 50 }">
    <SkyboxMaterial />
  </Sphere>
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3 } from 'three'
import { useGame, useInput, useNavigator } from '@/store'
import { Gateway } from '@/entities/Gateway'
import { UserAgent } from '@/entities/UserAgent'
import { GTouchStick } from '@/components'
import { SkyboxMaterial } from '@/materials'
import anime from 'animejs'

export default defineComponent({
  name: 'InsideServer',

  components: {
    GTouchStick,
    UserAgent,
    Gateway,
    SkyboxMaterial,
  },
  
  setup () {
    const { camera, renderer, deltaTime } = useGame()
    const { axis, setPrimaryAxis } = useInput()
    const { connectUserAgent } = useNavigator()

    return {
      deltaTime,
      renderer,
      camera,
      axis,
      setPrimaryAxis,
      connectUserAgent,
    }
  },

  data: () => ({
    radius: 8,
    displacement: 0,
    services: [
      { port: 7000 },
      { port: 2375 },
      { port: 5000 },
      { port: 3366 },
      { port: 7001 },
      { port: 2376 },
      { port: 5001 },
      { port: 3367 },
    ],
  }),

  mounted () {
    const { user } = this.$refs

    this.connectUserAgent(user.transform)

    anime({
      targets: this.camera.position,
      z: 10,
      y: 3,
      duration: 1000,
      easing: 'easeOutQuad'
    })

    this.renderer.onBeforeRender(this.onUpdate)
  },

  unmounted () {
    this.renderer.offBeforeRender(this.onUpdate)
  },

  methods: {
    onAccessServer (server) {
      console.log('accessed server on port', server.port)

      if (server.port === 7000)
        this.$router.push({ name: 'Playground' })
    },

    onTouchMove (direction) {
      this.setPrimaryAxis(direction)
    },

    onUpdate () {
      const { user } = this.$refs

      this.displacement += this.axis.x

      const t = this.displacement * (this.deltaTime / 2)

      user.transform.position.x = Math.sin(t) * (this.radius - .25)
      user.transform.position.z = Math.cos(t) * (this.radius - .25)
      user.transform.rotation.copy(this.camera.rotation)

      this.camera.position.x = Math.sin(t) * (this.radius + 3)
      this.camera.position.z = Math.cos(t) * (this.radius + 3)
      this.camera.lookAt(
        new Vector3(Math.sin(t) * (this.radius - 2), 0, Math.cos(t) * (this.radius - 2))
      )
    }
  }
})
</script>
