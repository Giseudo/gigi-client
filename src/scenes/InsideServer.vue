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

    <Pod ref="pod" @click="onPodClick" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Vector3 } from 'three'
import { useGame, usePointer, useWindow } from '@/store'
import { useGatewayService } from '@/services'
import { Gateway } from '@/entities/Gateway'
import { Pod } from '@/entities/Pod'
import { SkyboxMaterial } from '@/materials'
import { useSocket } from '@/store'
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
    const { fetchServices, selectPort, services, activePort } = useGatewayService()
    const { isMobile } = useWindow()
    const { pointer, pointerDown, pointerUp, pointerMove } = usePointer()
    const { socket } = useSocket()
    const pod = ref(null)
    const gatewayPosition = new Vector3()
    const displacement = ref(0)
    const touchDelta = ref(0)
    const isDragging = ref(false)
    const isAnimating = ref(false)

    onMounted(async () => {
      camera.value.attach(pod.value.transform)

      pod.value.moveTo({ y: -.4, z: -.75 })
      pod.value.lookAt(camera.value)
    })

    // FIXME we need to remove manually camera children :(
    onBeforeUnmount(() => {
      camera.value.remove(pod.value.transform)
      selectPort(null)
    })

    update(() => {
      const t = displacement.value

      camera.value.position.x = Math.sin(t) * (props.radius + 5.)
      camera.value.position.z = Math.cos(t) * (props.radius + 5.)
      camera.value.lookAt(gatewayPosition)
    })

    pointerDown(() => {
      touchDelta.value = 0
    })

    pointerMove(({ movementX }) => {
      if (!isMobile) return

      touchDelta.value -= movementX * deltaTime.value

      if (Math.abs(touchDelta.value) > .5) {
        isDragging.value = true
        displacement.value -= movementX * deltaTime.value * .01
      }
    })

    pointerUp(() => {
      if (!isDragging.value) return

      isDragging.value = false

      if (touchDelta.value < 0) slidePrev()
      if (touchDelta.value > 0) slideNext()
    })

    const currentIndex = computed(() => services.value.findIndex(({ port }) => port === activePort.value))

    const slideTo = (index) => {
      if (isAnimating.value) return

      const nextIndex = Math.mod(index, services.value.length)
      const isNext = currentIndex.value < index

      selectPort(null)
      isAnimating.value = true

      let d = (isNext ? Math.TAU : -Math.TAU) / services.value.length

      d -= Math.mod(displacement.value, d)

      anime({
        targets: displacement,
        value: displacement.value + d,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => {
          const service = services.value[nextIndex]

          selectPort(service?.port)
          isAnimating.value = false
        }
      })
    }

    const slidePrev = () => slideTo(currentIndex.value - 1)

    const slideNext = () => slideTo(currentIndex.value + 1)

    return {
      pod,
      displacement,
      gatewayPosition,
      pointer,
      camera,
      services,
      isMobile,
      selectPort,
      fetchServices,
      activePort,
      socket,
    }
  },

  props: {
    radius: {
      type: Number,
      default: 12,
    }
  },

  data: () => ({
    isLoading: true,
    isDragging: false,
    showGateway: false,
  }),

  mounted () {
    if (this.services.length) {
      this.showGateway = true

      const [ first ] = this.services

      this.selectPort(first?.port)
    }
  },

  methods: {
    onAccessService (service) {
      console.log('accessed service on port', service.port)

      this.$router.push({ name: 'Playground' })
    },

    onPodClick () {
      const { pod } = this.$refs
      let port = this.activePort

      this.socket.emit('pod:interact')

      this.socket.once('dialogue:start', () => {
        pod.moveTo({ y: 0 })

        this.selectPort(null)
      })

      this.socket.once('dialogue:end', async() => {
        pod.moveTo({ y: -.45 })

        if (!this.services.length) {
          await this.fetchServices()

          const [ first ] = this.services

          port = first?.port
        }

        this.showGateway = true
        this.selectPort(port)

        anime({
          targets: this.camera.position,
          y: 3,
          duration: 1000,
          easing: 'easeOutQuad',
        })
      })
    },
  }
})
</script>
