<template>
  <Server :radius="10" @port-access="onAccessPort" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Vector3 } from 'three'
import { useGame, useWindow } from '@/store'
import { Server } from './Server'
import anime from 'animejs'

const { camera } = useGame()
const { isMobile } = useWindow()
const router = useRouter()

onMounted(() => {
  camera.value.position.set(0, 0, 40)
  camera.value.lookAt(new Vector3())

  anime({
    targets: camera.value.position,
    z: isMobile.value ? 10 : 12,
    duration: 2000,
    easing: 'easeOutQuad'
  })
})

const onAccessPort = (port) => {
  anime({
    targets: camera.value.position,
    z: isMobile.value ? 18 : 14,
    easing: 'easeOutQuad',
    duration: 1000,
  })

  if (port === 443)
    anime({
      targets: camera.value.position,
      z: (isMobile.value ? 10 : 8),
      easing: 'easeInOutQuad',
      delay: 1000,
      duration: 3000,
      complete: () => router.push({ name: 'Server' })
    })
}
</script>
