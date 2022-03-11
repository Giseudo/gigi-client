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

<script setup>
import { onBeforeUnmount, ref, provide } from 'vue'
import { useGame, useCamera, useGameplay } from '@/store'
import { Vector3 } from 'three'
import { MetroStation } from './'
import { UserAgent } from '@/world/entities'
import socket from '@/socket'
import anime from 'animejs'

const { camera } = useGame()
const { pause, resume, setPlayer, boundaries, resetBoundaries } = useGameplay()
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
      boundaries.value.set(
        new Vector3(-6, -100, -100),
        new Vector3( 6,  100,  7.5)
      )
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

  boundaries.value.set(
    new Vector3(-10, -100, 8.5),
    new Vector3( 10,  100, 100)
    // new Vector3(-6, -100, -100),
    // new Vector3( 6,  100,  7.5)
  )
  setPlayer(userAgent.value)
  resume()
  console.log('hm')
}
  console.log('q')

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
  resetBoundaries()
})

const onRouterInteract = (transform) => {
  pause()

  cameraFollow(transform, { y: 1, z: 1 }, 1)
  cameraLookAt(transform, { y: 1 }, 1)
}
</script>
