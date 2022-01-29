<template>
  <div class="server-network">
    <Gateway ref="gateway"
      v-if="showGateway"
      :radius="radius"
      :services="services"
      :position="gatewayPosition"
      @access-service="onAccessService"
    />

    <Sphere :scale="{ x: 50, y: 50, z: 50 }">
      <SkyboxMaterial />
    </Sphere>

    <Pod ref="pod" @click="onPodInteract" />

    <!--transition name="fade">
      <span v-if="activePort" class="server-network__active-service">
        <b>{{ selectedService.name }}</b><br />
        Port: <b>{{ selectedService.port }}</b><br />
        Status: <b>Unreachable</b>
      </span>
    </transition-->

    <button v-if="!isMobile && showGateway"
      class="server-network__arrow server-network__arrow--left"
      @click="onPrevious"
    >
      Prev
    </button>

    <button v-if="!isMobile && showGateway"
      class="server-network__arrow server-network__arrow--right"
      @click="onNext"
    >
      Next
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { useGame, useInput, useNavigator, usePointer, useWindow } from '@/store'
import { useGatewayService, useDialogueService } from '@/services'
import { Gateway } from '@/entities/Gateway'
import { Pod } from '@/entities/Pod'
import { SkyboxMaterial } from '@/materials'
import anime from 'animejs'

export default defineComponent({
  name: 'InsideServer',

  components: {
    Gateway,
    SkyboxMaterial,
    Pod,
  },
  
  setup (props) {
    const { camera, deltaTime, update } = useGame()
    const { axis, setPrimaryAxis } = useInput()
    const { connectUserAgent } = useNavigator()
    const { fetchServices, selectPort, services, activePort } = useGatewayService()
    const { showDialogue, interact, interactedWithPod } = useDialogueService()
    const { isMobile } = useWindow()
    const { pointer } = usePointer()
    const gatewayPosition = new Vector3()
    const displacement = ref(0)

    update(() => {
      const t = displacement.value

      camera.value.position.x = Math.sin(t) * (props.radius + 5.)
      camera.value.position.z = Math.cos(t) * (props.radius + 5.)
      camera.value.lookAt(gatewayPosition)
    })

    return {
      displacement,
      gatewayPosition,
      pointer,
      deltaTime,
      update,
      camera,
      axis,
      setPrimaryAxis,
      connectUserAgent,
      services,
      isMobile,
      selectPort,
      fetchServices,
      activePort,
      showDialogue,
      interact,
      interactedWithPod
    }
  },

  props: {
    radius: {
      type: Number,
      default: 12,
    }
  },

  data: () => ({
    touchDelta: 0,
    isLoading: true,
    isAnimating: false,
    isDragging: false,
  }),

  computed: {
    selectedService () {
      return this.services.find(service => service.port === this.activePort) || {}
    },

    showGateway () {
      return !this.isLoading || this.interactedWithPod
    },
  },

  watch: {
    showGateway (value) {
      if (!value) return

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
    },

    showDialogue (value) {
      const { pod } = this.$refs

      const y = value ? 0 : -.45

      pod.moveTo({ y })

      if (!value)
        this.isLoading = false
    },
  },

  mounted () {
    this.init()

    this.pointer.subscribe('pointer-down', this.onPointerDown)
    this.pointer.subscribe('pointer-move', this.onPointerMove)
    this.pointer.subscribe('pointer-up', this.onPointerUp)
  },

  beforeUnmount () {
    // FIXME we need to remove manually camera children :(
    const { pod } = this.$refs

    this.camera.remove(pod.transform)
    this.selectPort(null)

    this.pointer.unsubscribe('pointer-down', this.onPointerDown)
    this.pointer.unsubscribe('pointer-move', this.onPointerMove)
    this.pointer.unsubscribe('pointer-up', this.onPointerUp)
  },

  methods: {
    async init () {
      const { pod } = this.$refs

      this.camera.attach(this.$refs.pod.transform)

      pod.moveTo({ y: -.4, z: -.75 })
      pod.lookAt(this.camera)

      await this.fetchServices()

      if (this.interactedWithPod) {
        anime({
          targets: this.camera.position,
          y: 3,
          duration: 1000,
          easing: 'easeOutQuad',
        })

        if (!this.services.length) return

        const [ first ] = this.services

        this.selectPort(first.port)
      }
    },

    onPodInteract () {
      this.interact()
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
      console.log('accessed service on port', service.port)

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

    /*
    // TODO Where this belongs?
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
    transform: translateY(-50%) rotateZ(45deg);
    width: 60px;
    height: 60px;
    background: rgba(black, .5);
    color: white;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    cursor: pointer;

    &--left { left: 40px; }
    &--right { right: 40px; }
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
