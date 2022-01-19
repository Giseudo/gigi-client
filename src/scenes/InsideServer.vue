<template>
  <Gateway ref="gateway"
    v-if="!isLoading"
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
import { useGatewayService } from '@/services'
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
    const { fetchServices, services } = useGatewayService()

    return {
      deltaTime,
      renderer,
      camera,
      axis,
      setPrimaryAxis,
      connectUserAgent,
      services,
      fetchServices,
    }
  },

  data: () => ({
    radius: 12,
    displacement: 0,
    isLoading: true,
    isAnimating: false,
    gatewayPosition: new Vector3(),
  }),

  mounted () {
    this.init()
  },

  unmounted () {
    this.renderer.offBeforeRender(this.onUpdate)
  },

  methods: {
    async init () {
      const { user } = this.$refs

      await this.fetchServices()

      this.connectUserAgent(user.transform)

      anime({
        targets: this.camera.position,
        z: 10,
        y: 3,
        duration: 1000,
        easing: 'easeOutQuad'
      })

      this.renderer.onBeforeRender(this.onUpdate)

      this.isLoading = false
    },

    onAccessService (service) {
      console.log('accessed servervice on port', service.port)

      if (service.port === 7000)
        this.$router.push({ name: 'Playground' })
    },

    onToggleService () {
      /*
      anime.remove(this.camera)

      anime({
        targets: this.camera,
        fov: service ? 75 : 60,
        duration: service ? 1000 : 2000,
        easing: 'easeOutQuad',
        update: () => this.camera.updateProjectionMatrix()
      })
      */
    },

    onSelectService (service) {
      if (this.isAnimating) return

      const count = this.services.length
      const index = this.services.indexOf(service)

      this.isAnimating = true

      anime({
        targets: this,
        displacement: (Math.TAU / count) * index,
        duration: 2000,
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
