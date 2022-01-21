<template>
  <div class="server-network">
    <Gateway ref="gateway"
      v-if="!isLoading"
      :radius="radius"
      :services="services"
      :position="gatewayPosition"
    />

    <Sphere :scale="{ x: 50, y: 50, z: 50 }">
      <SkyboxMaterial />
    </Sphere>

    <transition name="fade">
      <span v-if="activePort" class="server-network__active-service">
        <b>{{ selectedService.name }}</b><br />
        Port: <b>{{ selectedService.port }}</b><br />
        Status: <b>Unrecheable</b>
      </span>
    </transition>

    <button
      class="server-network__arrow server-network__arrow--left"
      @click="onPrevious"
    />

    <button
      class="server-network__arrow server-network__arrow--right"
      @click="onNext"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3 } from 'three'
import { useGame, useInput, useNavigator, usePointer, useWindow } from '@/store'
import { useGatewayService } from '@/services'
import { Gateway } from '@/entities/Gateway'
import { SkyboxMaterial } from '@/materials'
import anime from 'animejs'

export default defineComponent({
  name: 'InsideServer',

  components: {
    Gateway,
    SkyboxMaterial,
  },
  
  setup () {
    const { camera, renderer, deltaTime } = useGame()
    const { axis, setPrimaryAxis } = useInput()
    const { connectUserAgent } = useNavigator()
    const { fetchServices, selectPort, services, activePort } = useGatewayService()
    const { isMobile } = useWindow()
    const { pointer } = usePointer()

    return {
      pointer,
      deltaTime,
      renderer,
      camera,
      axis,
      setPrimaryAxis,
      connectUserAgent,
      services,
      isMobile,
      selectPort,
      fetchServices,
      activePort,
    }
  },

  data: () => ({
    radius: 12,
    displacement: 0,
    touchDelta: 0,
    isLoading: true,
    isAnimating: false,
    isDragging: false,
    gatewayPosition: new Vector3(),
  }),

  computed: {
    selectedService () {
      return this.services.find(service => service.port === this.activePort) || {}
    }
  },

  mounted () {
    this.init()

    this.pointer.subscribe('pointer-down', this.onPointerDown)
    this.pointer.subscribe('pointer-move', this.onPointerMove)
    this.pointer.subscribe('pointer-up', this.onPointerUp)
  },

  unmounted () {
    this.renderer.offBeforeRender(this.onUpdate)

    this.pointer.unsubscribe('pointer-down', this.onPointerDown)
    this.pointer.unsubscribe('pointer-move', this.onPointerMove)
    this.pointer.unsubscribe('pointer-up', this.onPointerUp)
  },

  methods: {
    async init () {
      await this.fetchServices()

      this.camera.fov = this.isMobile ? 80 : 60
      this.camera.updateProjectionMatrix()

      anime({
        targets: this.camera.position,
        y: 3,
        duration: 1000,
        easing: 'easeOutQuad',
        complete: () => {
          if (this.services.length) {
            const [ first ] = this.services

            this.selectPort(first.port)
          }
        }
      })

      this.renderer.onBeforeRender(this.onUpdate)

      this.isLoading = false
    },

    onPrevious () {
      const index = this.services.indexOf(this.selectedService)

      if (index < 0) return
      if (this.isAnimating) return

      this.selectPort(null)
      this.isAnimating = true

      let d = -Math.TAU / this.services.length
      d -= Math.mod(this.displacement, d)

      anime({
        targets: this,
        displacement: this.displacement + d,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => {
          const prevIndex = Math.mod(index - 1, this.services.length)
          const service = this.services[prevIndex]
          this.selectPort(service.port)

          this.isAnimating = false
        }
      })
    },

    onNext () {
      const index = this.services.indexOf(this.selectedService)

      if (index < 0) return
      if (this.isAnimating) return

      this.selectPort(null)
      this.isAnimating = true

      let d = Math.TAU / this.services.length
      d -= Math.mod(this.displacement, d)

      anime({
        targets: this,
        displacement: this.displacement + d,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => {
          const nextIndex = Math.mod(index + 1, this.services.length)
          const service = this.services[nextIndex]
          this.selectPort(service.port)

          this.isAnimating = false
        }
      })
    },

    onAccessService (service) {
      console.log('accessed servervice on port', service.port)

      if (service.port === 7000)
        this.$router.push({ name: 'Playground' })
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

    onPointerDown () {
      this.touchDelta = 0
    },

    onPointerMove ({ message }) {
      if (!this.isMobile) return

      this.touchDelta -= message.movementX * this.deltaTime

      if (Math.abs(this.touchDelta) > .5) {
        this.isDragging = true
        this.displacement -= message.movementX * this.deltaTime * .01
      }
    },

    onPointerUp () {
      if (!this.isDragging) return

      this.isDragging = false

      if (this.touchDelta < 0) this.onPrevious()
      if (this.touchDelta > 0) this.onNext()
    },

    onUpdate () {
      // const { user } = this.$refs
      // this.displacement += this.axis.x * (this.deltaTime / 3)

      /*user.transform.position.x = Math.sin(t) * (this.radius - .5)
      user.transform.position.z = Math.cos(t) * (this.radius - .5)

      if (this.axis.x !== 0 || this.axis.y !== 0) {
        const targetPosition = this.getOrientedAxis(this.axis)
          .add(user.transform.position)

        user.transform.lookAt(targetPosition)
      }
      */
      const t = this.displacement

      this.camera.position.x = Math.sin(t) * (this.radius + 5.)
      this.camera.position.z = Math.cos(t) * (this.radius + 5.)
      this.camera.lookAt(this.gatewayPosition)
    },

    /*
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
    */
  }
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

.server-network {
  &__active-service {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 11px;
    letter-spacing: 3px;
    line-height: 200%;
    font-family: Roboto, Helvetica, Arial;
    font-weight: 400;
    color: white;
    text-transform: lowercase;
    background: linear-gradient(to top, rgba(black, .7) 0%, rgba(black, 0) 100%);
    padding: 120px 40px 40px;
    pointer-events: none;
    text-transform: uppercase;

    &:before {
      content: "";
      position: absolute;
      left: 20px;
      bottom: 20px;
      top: 100px;
      border-left: 2px solid white;
    }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    background: rgba(black, .5);
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    cursor: pointer;
    opacity: 0;

    &--left { left: 20px; }
    &--right { right: 20px; }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
