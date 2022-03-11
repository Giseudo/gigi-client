<template>
  <Sphere :scale="{ x: 50, y: 50, z: 50 }">
    <SkyboxMaterial />
  </Sphere>

  <Pod ref="pod" @click="onPodClick" />

  <RouterView />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Pod } from '@/world/entities'
import { useGame } from '@/store'
import { useRouter } from 'vue-router'
import socket from '@/socket'

const { camera } = useGame()
const router = useRouter()
const pod = ref(null)

onMounted(async () => {
  camera.value.attach(pod.value.transform)

  pod.value.moveTo({ y: -.3, z: -.75 })
  pod.value.lookAt(camera.value)
})

onBeforeUnmount(() => {
  // FIXME we need to remove manually camera children :(
  camera.value.remove(pod.value.transform)
})

const onPodClick = () => {
  socket.emit('interact', 'pod')

  socket.once('dialogue:start', () => {
    pod.value.moveTo({ y: 0 })
  })

  socket.once('dialogue:end', async () => {
    pod.value.moveTo({ y: -.3 })
    router.push({ name: 'ServerGateway' })
  })
}
</script>
