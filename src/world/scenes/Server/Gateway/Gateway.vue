<template>
  <MetroStation ref="metroStation"
    @gate-in="onEnterGate"
    @gate-out="onExitGate"
    @router-panel:start="onRouterInteract"
    @router-panel:end="onRouterInteractEnd"
  >
    <UserAgent ref="userAgent" v-if="true"
      :position="userPosition"
      @load="onPlayerLoad"
    />
  </MetroStation>
</template>

<script setup>
import { onBeforeUnmount, ref, inject } from 'vue'
import { useCamera, useGameplay } from '@/store'
import { Vector3 } from 'three'
import { MetroStation } from './'
import { UserAgent } from '@/world/entities'
import { useServerStore } from '../serverStore'
import socket from '@/socket'
import anime from 'animejs'

const { pause, resume, setPlayer, boundaries, resetBoundaries } = useGameplay()
const { cameraFollow, cameraLookAt } = useCamera()
const { isInsideServer, enterServer } = useServerStore()
const pod = inject('pod')
const userAgent = ref(null)
const metroStation = ref(null)
const userPosition = isInsideServer.value ? { x: 0, y: 0, z: 4 } : { x: 0, y: 5, z: 55 }

const openGate = (gate) => {
  enterServer()
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
      updateBoundaries()
      gate.close()
      resume()
    }
  })
}

const onPlayerLoad = () => {
  cameraFollow(userAgent.value.transform, { y: 2, z: 3 }, 8)
  cameraLookAt(userAgent.value.transform, { y: 1, z: -.75 }, 8)

  pod.value.moveTo({ y: -1 })

  updateBoundaries()
  setPlayer(userAgent.value)

  resume()
}

const updateBoundaries = () => {
  const min = isInsideServer.value ? new Vector3(-6, -100, -100) : new Vector3(-10, -100, 8.5)
  const max = isInsideServer.value ? new Vector3( 6,  100,  7.5) : new Vector3( 10,  100, 100)

  boundaries.value.set(min, max)
}

const onEnterGate = (gate) => {
  if (isInsideServer.value) return

  socket.emit('interact', 'metro-gate-in')
  socket.once('interaction:end', () => openGate(gate))
}

const onExitGate = () => {
  if (isInsideServer.value) return

  socket.emit('interact', 'metro-gate-out')
}

onBeforeUnmount(() => {
  setPlayer(null)
  cameraFollow(null)
  cameraLookAt(null)
  resetBoundaries()

  pod.value.moveTo({ y: -.3, z: -.75 })
})

const onRouterInteract = (transform) => {
  pause()

  cameraFollow(transform, { y: 1, z: 1 }, 1)
  cameraLookAt(transform, { y: 1 }, 1)
}

const onRouterInteractEnd = () => {
  resume()

  cameraFollow(userAgent.value.transform, { y: 2, z: 3 }, 8)
  cameraLookAt(userAgent.value.transform, { y: 1, z: -.75 }, 8)
}
</script>
