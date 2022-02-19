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
import { useGame, usePointer, useWindow, useDialogue, useAlert } from '@/store'
import { useGatewayService } from '@/services'
import { Gateway } from '@/world/entities/Gateway'
import { Pod } from '@/world/entities/Pod'
import { SkyboxMaterial } from '@/world/materials'
import { useRouter } from 'vue-router'
import socket from '@/socket'
import anime from 'animejs'

export default defineComponent({
  name: 'InsideServer',

  beforeRouteLeave () {
    this.closeDialogue()
  },

  components: {
    Gateway,
    SkyboxMaterial,
    Pod,
  },
  
  setup (props) {
    const { camera, deltaTime, update } = useGame()
    const { fetchServices, selectPort, services, activePort } = useGatewayService()
    const { isMobile } = useWindow()
    const { pointerDown, pointerUp, pointerMove } = usePointer()
    const { closeDialogue } = useDialogue()
    const { openAlert } = useAlert()
    const router = useRouter()
    const pod = ref(null)
    const gatewayPosition = new Vector3()
    const displacement = ref(0)
    const touchDelta = ref(0)
    const isDragging = ref(false)
    const isAnimating = ref(false)
    const showGateway = computed(() => services.value.length > 0)

    onMounted(async () => {
      camera.value.attach(pod.value.transform)

      anime({
        targets: camera.value.position,
        y: 3,
        duration: 1000,
        easing: 'easeOutQuad',
      })

      pod.value.moveTo({ y: -.3, z: -.75 })
      pod.value.lookAt(camera.value)

      if (services.value.length) {
        const [ first ] = services.value

        selectPort(first?.port)
      }
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
      if (!isMobile.value) return

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

    const onPodClick = () => {
      let port = activePort.value

      socket.emit('interact', 'pod')

      socket.once('dialogue:start', () => {
        pod.value.moveTo({ y: 0 })

        selectPort(null)
      })

      socket.once('dialogue:end', async () => {
        pod.value.moveTo({ y: -.3 })

        if (!services.value.length) {
          await fetchServices()

          const [ first ] = services.value

          port = first?.port
        }

        selectPort(port)
      })
    }

    const onAccessService = (service) => {
      openAlert({
        title: `REGISTRY SERVICE`,
        message: '',
        dark: false,
        cancel: true,
        confirmText: 'Access',
        onConfirm: (done) => {
          router.push({
            name: service.port === 5000 ? 'APIGateway' : 'Playground'
          }) 

          done()
        }
      })
    }

    return {
      pod,
      gatewayPosition,
      services,
      showGateway,
      closeDialogue,
      onPodClick,
      onAccessService
    }
  },

  props: {
    radius: {
      type: Number,
      default: 12,
    }
  },
})
</script>
