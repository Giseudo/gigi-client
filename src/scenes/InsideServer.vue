<template>
  <Gateway ref="gateway"
    :radius="radius"
    :services="services"
    :position="gatewayPosition"
    @access-service="onAccessService"
    @toggle-service="onToggleService"
    @previous="onSelectService"
    @next="onSelectService"
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

// const FORWARD = new Vector3(0, 0, -1)

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
    radius: 12,
    displacement: 0,
    isAnimating: false,
    gatewayPosition: new Vector3(),
    services: [
      { port: 7000, name: 'Playground', thumbnail: '/images/placeholder.png' },
      { port: 3366, name: 'Database', thumbnail: '/images/database.webp' },
      { port: 2375, name: 'Registry', thumbnail: '/images/placeholder.png' },
      { port: 5000, name: 'Storage', thumbnail: '/images/placeholder.png' },
      { port: 7001, name: 'Playground', thumbnail: '/images/megaman-legends.jpg' },
      { port: 2376, name: 'Register Office', thumbnail: '/images/megaman-legends.jpg' },
      { port: 5001, name: 'Resources', thumbnail: '/images/placeholder.png' },
      { port: 3367, name: 'Database', thumbnail: '/images/database.webp' },
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
    onAccessService (service) {
      console.log('accessed servervice on port', service.port)

      if (service.port === 7000)
        this.$router.push({ name: 'Playground' })
    },

    onToggleService (service) {
      anime.remove(this.camera)

      anime({
        targets: this.camera,
        fov: service ? 75 : 60,
        duration: service ? 1000 : 2000,
        easing: 'easeOutQuad',
        update: () => this.camera.updateProjectionMatrix()
      })
    },

    onSelectService (service) {
      if (this.isAnimating) return

      const count = this.services.length
      const index = this.services.indexOf(service)

      this.isAnimating = true

      anime({
        targets: this,
        displacement: (Math.TAU / count) * index,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => this.isAnimating = false
      })
    },

    onTouchMove (direction) {
      this.setPrimaryAxis(direction)
    },

    onUpdate () {
      const { user } = this.$refs

      this.displacement += this.axis.x * (this.deltaTime / 3)

      const t = this.displacement

      user.transform.position.x = Math.sin(t) * (this.radius - .5)
      user.transform.position.z = Math.cos(t) * (this.radius - .5)

      if (this.axis.x !== 0 || this.axis.y !== 0) {
        const targetPosition = this.getOrientedAxis(this.axis)
          .add(user.transform.position)

        user.transform.lookAt(targetPosition)
      }

      this.camera.position.x = Math.sin(t) * (this.radius + 5.)
      this.camera.position.z = Math.cos(t) * (this.radius + 5.)
      this.camera.lookAt(this.gatewayPosition)
    },

    getOrientedAxis (direction) {
      if (!this.camera) return direction

      const right = new Vector3(1, 0, 0)
        .applyQuaternion(this.camera.quaternion)
      right.y = 0
      right.normalize()

      const forward = new Vector3(0, 0, -1)
        .applyQuaternion(this.camera.quaternion)
      forward.y = 0
      forward.normalize()

      return right.multiplyScalar(direction.x)
        .add(forward.multiplyScalar(direction.y))
    }
  }
})
</script>
