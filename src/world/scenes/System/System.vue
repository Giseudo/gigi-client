<template>
  <Group ref="transform">
    <Cylinder
      :radius-top=".5"
      :radius-bottom=".5"
      :height="radius * 2"
      :position="{ y: radius + .5 }"
    >
      <BlockMaterial color="#505050" />
    </Cylinder>

    <Sphere ref="core" :radius=".2">
      <BlockMaterial color="#505050" />
    </Sphere>

    <Cylinder
      :radius-top=".5"
      :radius-bottom=".5"
      :height="radius * 2"
      :position="{ y: -radius - .5 }"
    >
      <BlockMaterial color="#505050" />
    </Cylinder>

    <Service
      v-for="(service, index) in services"
      :ref="el => services[index].component = el"
      :key="index"
      :port="service.port"
      :position="getServicePosition(index)"
      :thumbnail="service.thumbnail"
      @click="onAccessService(service)"
    />
  </Group>

  <Sphere :scale="{ x: 50, y: 50, z: 50 }">
    <SkyboxMaterial />
  </Sphere>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, computed, provide } from 'vue'
import { useGame, usePointer, useWindow, useDialogue, useAlert } from '@/store'
import { Vector3 } from 'three'
import { Service } from './Service'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import anime from 'animejs'

const { camera, deltaTime, update } = useGame()
const { isMobile } = useWindow()
const { pointerDown, pointerUp, pointerMove } = usePointer()
const { closeDialogue } = useDialogue()
const { openAlert } = useAlert()
const router = useRouter()

const transform = ref(null)  
const core = ref(null)
const radius = computed(() => props.radius)
const gatewayPosition = new Vector3()
const displacement = ref(0)
const touchDelta = ref(0)
const isDragging = ref(false)
const isAnimating = ref(false)
const activePort = ref(7000)
const services = ref([
  { port: 7000, name: 'PHP' },
  { port: 2375, name: 'MongoDB' },
  { port: 5000, name: 'Frontend' },
  { port: 3366, name: 'MySQL' },
])

defineEmits([ 'access-services' ])

provide('activePort', computed(() => activePort.value))

const props = defineProps({
 radius: {
    type: Number,
    default: 8
  },

  position: {
    type: [ Object, Vector3 ],
    default: () => ({ x: 0, y: 0, z: 0 })
  }
})

onBeforeRouteLeave(() => {
  closeDialogue()
})

onMounted(() => {
  const up = new Vector3(0, 1, 0)
  const target = core.value.mesh.position.clone()

  for (let i = 0; i < services.value?.length; i++) {
    const service = services.value[i].component?.transform.group
    target.y = service.position.y

    service.lookAt(target)
    service.rotateOnAxis(up, Math.PI)
  }

  camera.value.position.z = 12
})

const getServicePosition = (index) => {
  const count = services.value.length
  const x = Math.sin((Math.TAU / count) * index) * (radius.value - 1.75)
  const y = -.25
  const z = Math.cos((Math.TAU / count) * index) * (radius.value - 1.75)

  return { x, y, z}
}

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

const selectPort = value => {
  activePort.value = value

  return services.value
    .find(service => service.port === value) || {}
}
</script>
