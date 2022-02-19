<template>
  <MetroStation ref="metroStation"
    @open-gate="onGateOpen"
    @router-panel="onRouterInteract"
  />

  <UserAgent ref="userAgent"
    :position="{ x: 0, y: 0, z: 12 }"
  />
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, ref, provide } from 'vue'
import { useGame, useCamera, useNavmesh, useGameplay } from '@/store'
import { Vector3 } from 'three'
import { MetroStation, Gatekeeper } from './'
import UserAgent from '../../entities/UserAgent/UserAgent.vue'
import anime from 'animejs'

export default defineComponent({
  name: 'APIGateway',

  components: {
    MetroStation,
    Gatekeeper,
    UserAgent,
  },

  setup () {
    const { camera, deltaTime, update } = useGame()
    const { clampStep } = useNavmesh()
    const { pause, resume, axis, setPlayer } = useGameplay()
    const { cameraFollow, cameraLookAt } = useCamera()
    const userAgent = ref(null)
    const metroStation = ref(null)
    const direction = new Vector3()
    const isInside = ref(false)

    provide('isInside', isInside)

    const onGateOpen = (gate) => {
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

    onMounted(() => {
      resume()

      camera.value.position.y = 3
      camera.value.position.z = 8

      setPlayer(userAgent.value)

      cameraFollow(userAgent.value.transform, { y: 2, z: 3 })
      cameraLookAt(userAgent.value.transform, { y: 1 })

      isInside.value = userAgent.value.transform.position.z < 8.5
    })

    onBeforeUnmount(() => {
      setPlayer(null)
    })

    const onRouterInteract = (transform) => {
      pause()

      cameraFollow(transform, { y: 1, z: 1 }, .5)
      cameraLookAt(transform, { y: 1 }, 1)
    }

    update(() => {
      const { x, y } = axis.value

      if (x === 0 && y === 0) return

      const newPosition = userAgent.value.transform.position.clone()

      newPosition.x += x * deltaTime.value * 4
      newPosition.z -= y * deltaTime.value * 4

      if (!isInside.value && newPosition.z < 8.5 || isInside.value && newPosition.z > 8)
        newPosition.z = userAgent.value.transform.position.z

      clampStep(
        metroStation.value.zoneName,
        userAgent.value.transform.position,
        newPosition
      )

      const desiredDirection = userAgent.value.transform.position.clone()

      desiredDirection.x += x
      desiredDirection.z -= y

      const smoothDirection = direction.lerpVectors(
        direction,
        desiredDirection,
        deltaTime.value * 5
      )
      smoothDirection.y = userAgent.value.transform.position.y

      userAgent.value.transform.lookAt(smoothDirection)
    })

    return {
      userAgent,
      metroStation,
      onRouterInteract,
      onGateOpen
    }
  }
})
</script>
