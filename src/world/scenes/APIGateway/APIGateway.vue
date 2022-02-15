<template>
  <MetroStation ref="metroStation"
    @open-gate="onGateOpen"
  />

  <UserAgent ref="userAgent"
    :position="{ x: 0, y: 0, z: 12 }"
  />
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, ref, provide } from 'vue'
import { useGame, useInput, useNavmesh, useInteraction } from '@/store'
import { Vector3 } from 'three'
import { MetroStation, Gatekeeper } from './'
import socket from '@/socket'
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
    const { axis, buttonDown, enableGameplayInput, disableGameplayInput } = useInput()
    const { clampStep } = useNavmesh()
    const { interactions } = useInteraction()
    const userAgent = ref(null)
    const metroStation = ref(null)
    const direction = new Vector3()
    const currentInteraction = ref(null)
    const isInside = ref(false)

    provide('isInside', isInside)

    const onGatekeeperClick = () => {
      socket.emit('gatekeeper:interact')
    }

    const onGateOpen = (gate) => {
      gate.open()

      anime({
        targets: userAgent.value.transform.position,
        z: 7.5,
        delay: 500,
        duration: 1000,
        easing: 'linear',
        complete: () => gate.close()
      })

      isInside.value = true
    }

    onMounted(() => {
      camera.value.position.y = 3
      camera.value.position.z = 8
      camera.value.lookAt(new Vector3(0, -2, 0))

      /*
        camera.value.position.z = .5
        camera.value.position.y = 1
        camera.value.lookAt(new Vector3(0, .75, -.5))
      */

      enableGameplayInput()
    })

    onBeforeUnmount(() => {
      disableGameplayInput()
    })

    const userMovement = () => {
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
    }

    const cameraMovement = () => {
      const { x, y, z } = userAgent.value.transform.position

      camera.value.position.x = x
      camera.value.position.y = y + 2
      camera.value.position.z = z + 2

      const cameraTarget = userAgent.value.transform.position.clone()
      cameraTarget.y += 1

      camera.value.lookAt(cameraTarget)
    }

    // leave this to the UI?
    // but we need a way to get player's position from anywhere
    const isInteracting = ref(false)
    const checkInteractions = () => {
      const interaction = interactions.value
        .find(interaction =>
          interaction.transform.position.distanceTo(
            userAgent.value.transform.position
          ) < interaction.radius / 2
        )

      if (!interaction)
        isInteracting.value = false

      currentInteraction.value = interaction
    }
    buttonDown(({ button }) => {
      if (isInteracting.value) return
      if (button !== 'confirm') return

      currentInteraction.value?.callback()
      isInteracting.value = true
    })

    update(() => {
      userMovement()
      cameraMovement()
      checkInteractions()
    })

    return {
      userAgent,
      metroStation,
      onGatekeeperClick,
      onGateOpen
    }
  }
})
</script>
