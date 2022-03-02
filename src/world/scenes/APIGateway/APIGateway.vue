<template>
  <MetroStation ref="metroStation"
    @gate-in="onEnterGate"
    @gate-out="onExitGate"
    @router-panel="onRouterInteract"
  >
    <UserAgent ref="userAgent"
      :position="{ z: 12 }"
      @load="onPlayerLoad"
    />
  </MetroStation>
</template>

<script>
import { defineComponent, onBeforeUnmount, ref, provide } from 'vue'
import { useGame, useCamera, useGameplay } from '@/store'
import { MetroStation, Gatekeeper } from './'
import UserAgent from '../../entities/UserAgent/UserAgent.vue'
import socket from '@/socket'
import anime from 'animejs'

export default defineComponent({
  name: 'APIGateway',

  components: {
    MetroStation,
    Gatekeeper,
    UserAgent,
  },

  setup () {
    const { camera } = useGame()
    const { pause, resume, setPlayer } = useGameplay()
    const { cameraFollow, cameraLookAt } = useCamera()
    const userAgent = ref(null)
    const metroStation = ref(null)
    const isInside = ref(false)

    provide('isInside', isInside)

    const openGate = (gate) => {
      isInside.value = true
      pause()

      anime({
        targets: userAgent.value.transform.position,
        z: 7.5,
        delay: 500,
        duration: 1000,
        easing: 'linear',
        begin: () => {
          gate.open()
        },
        complete: () => {
          gate.close()
          resume()
        }
      })
    }

    const onPlayerLoad = () => {
      camera.value.position.y = 3
      camera.value.position.z = 8

      cameraFollow(userAgent.value.transform, { y: 2, z: 3 })
      cameraLookAt(userAgent.value.transform, { y: 1 })

      isInside.value = userAgent.value.transform.position.z < 8.5

      setPlayer(userAgent.value)
      resume()
    }

    const onEnterGate = (gate) => {
      if (isInside.value) return

      socket.emit('interact', 'metro-gate-in')
      socket.once('interaction:end', () => openGate(gate))
    }

    const onExitGate = () => {
      if (isInside.value) return

      socket.emit('interact', 'metro-gate-out')
    }

    onBeforeUnmount(() => {
      setPlayer(null)
    })

    const onRouterInteract = (transform) => {
      pause()

      cameraFollow(transform, { y: 1, z: 1 }, 1)
      cameraLookAt(transform, { y: 1 }, 1)
    }

    return {
      userAgent,
      metroStation,
      onRouterInteract,
      onPlayerLoad,
      onEnterGate,
      onExitGate
    }
  }
})
</script>
