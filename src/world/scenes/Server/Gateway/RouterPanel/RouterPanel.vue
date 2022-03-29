<template>
  <Group v-bind="$attrs" ref="root">
    <Group :position="center" ref="pivot">
      <RouterRoute
        v-for="(route, index) in routes"
        :ref="el => routes[index].component = el"
        :key="route"
        :position="getPosition(index)"
        @click="onRouteClick(route)"
      />
    </Group>

    <Group ref="screen"
      :scale="{ x: 0, y: .01, z: 1 }"
      :position="{ y: 3, z: -4 }"
      :rotation="{ x: Math.PI * .1 }"
    >
      <Spinner :scale="{ x: 1.5, y: 1.5 }" :is-loading="isLoading" />

      <Plane :position="{ z: -.01 }" :scale="{ x: 4, y: 2.5 }" @click="onRouteClick(currentRoute)">
        <ProjectionMaterial ref="screenMaterial" :texture="currentRoute?.thumbnail" />
      </Plane>
    </Group>

    <Teleport to="body #app" v-if="isInteracting">
      <ThemeProvider theme="dark">
        <div class="router-panel">
          <GButton class="router-panel__close" jumbo @click="onClose">X</GButton>

          <GButton class="router-panel__button router-panel__button--prev" @click="onPrevious">
            PREV
          </GButton>

          <GButton class="router-panel__button router-panel__button--next" @click="onNext">
            NEXT
          </GButton>

          <transition name="fade">
            <div class="router-panel__details" v-if="!isAnimating">
              <GText type="subheading">ROUTE</GText>
              <GText type="heading">{{ currentRoute?.path }}</GText>
              <GText type="subheading">PORT</GText>
              <GText type="heading">{{ currentRoute?.port }}</GText>
            </div>
          </transition>
        </div>
      </ThemeProvider>
    </Teleport>
  </Group>
</template>

<script setup>
import { ref, defineExpose, defineEmits, computed, onMounted } from 'vue'
import { useInteraction, useAlert } from '@/store'
import { Vector3 } from 'three'
import { Spinner } from '@/world/components/Spinner'
import { useRouter } from 'vue-router'
import RouterRoute from './RouterRoute.vue'
import anime from 'animejs'

import thumbnail01 from '/textures/services/27017-thumb.webp?url'
import thumbnail02 from '/textures/services/5000-thumb.jpg?url'
import thumbnail03 from '/textures/services/placeholder-thumb.png?url'

const root = ref(null)
const pivot = ref(null)
const screen = ref(null)
const routes = ref([
  {
    path: '/api/auth',
    port: 3000,
    thumbnail: thumbnail01,
  },
  {
    path: '/api/users',
    port: 7000,
    thumbnail: thumbnail02,
  },
  {
    path: '/api/posts',
    port: 5000,
    thumbnail: thumbnail03,
  },
  {
    path: '/api/mailing',
    port: 9000,
    thumbnail: thumbnail03,
  }
])
const radius = 2.75
const center = new Vector3(0, 1, -2)
const transform = computed(() => root.value?.group)
const screenMaterial = ref(null)
const isInteracting = ref(false)
const isAnimating = ref(false)
const isLoading = ref(true)
const count = computed(() => routes.value.length)
const activeIndex = ref(0)
const currentRoute = computed(() => routes.value[activeIndex.value] || {})

const { createInteraction } = useInteraction()
const { openAlert } = useAlert()
const router = useRouter()
const emit = defineEmits([ 'interact', 'close' ])

const onInteract = () => {
  isInteracting.value = true
  turnScreenOn()

  emit('interact', transform.value)
}

const onClose = () => {
  turnScreenOff()

  setTimeout(() => {
    emit('close')
    isInteracting.value = false
  }, 300)
}

const getPosition = index => {
  const x = Math.sin((Math.TAU / count.value) * index) * (radius - 1.75)
  const y = 0
  const z = Math.cos((Math.TAU / count.value) * index) * (radius - 1.75)

  return { x, y, z }
}

const onPrevious = () => {
  if (isAnimating.value) return

  anime({
    targets: pivot.value.group.rotation,
    y: pivot.value.group.rotation.y + Math.TAU / count.value,
    duration: 700,
    easing: 'easeInOutQuad',
    begin: () => {
      turnScreenOff()
      isAnimating.value = true
    },
    complete: () => {
      turnScreenOn()
      isAnimating.value = false

      activeIndex.value--

      if (activeIndex.value < 0)
        activeIndex.value = routes.value.length - 1
    },
  })
}

const onNext = () => {
  if (isAnimating.value) return

  anime({
    targets: pivot.value.group.rotation,
    y: pivot.value.group.rotation.y - Math.TAU / count.value,
    duration: 700,
    easing: 'easeInOutQuad',
    begin: () => {
      turnScreenOff()
      isAnimating.value = true
    },
    complete: () => {
      turnScreenOn()
      isAnimating.value = false

      activeIndex.value++

      if (activeIndex.value >= routes.value.length)
        activeIndex.value = 0
    },
  })
}

const turnScreenOn = () => {
  const { uFade } = screenMaterial.value.materialProps.uniforms

  uFade.value = 1.

  anime.timeline({
    targets: screen.value.group.scale,
    duration: 150,
    easing: 'easeInQuad'
  })
    .add({ x: 1 })
    .add({ y: 1 })

  anime({
    targets: uFade,
    value: 0.,
    delay: 500,
    duration: 150,
    easing: 'linear',
  })

  isLoading.value = true
  setTimeout(() => isLoading.value = false, 500)
}

const turnScreenOff = () => {
  const { uFade } = screenMaterial.value.materialProps.uniforms

  uFade.value = 1.

  anime.timeline({
    targets: screen.value.group.scale,
    duration: 150,
    easing: 'easeOutQuad'
  })
    .add({ y: .01 })
    .add({ x: 0 })

  anime({
    targets: uFade,
    value: 0.,
    delay: 500,
    duration: 150,
    easing: 'linear',
  })
}

const onRouteClick = (route) => {
  if (!isInteracting.value) return

  const index = routes.value.findIndex(({ port }) => port === route.port)

  if (index !== activeIndex.value) return

  openAlert({
    title: currentRoute.value?.path,
    message: '',
    dark: false,
    cancel: true,
    confirmText: 'Access',
    onConfirm: (done) => {
      router.push({
        name: 'Playground'
      }) 

      done()
    }
  })
}

onMounted(() => {
  const { uFade } = screenMaterial.value.materialProps.uniforms
  uFade.value = 0.

  routes.value.forEach(({ component }) => {
    const { up } = component.transform
    const lookAtPosition = transform.value.position.clone().add(center)

    component.transform.lookAt(lookAtPosition)
    component.transform.rotateOnAxis(up, Math.PI)
  })
})

createInteraction('router-panel', 'Access', transform, 2, onInteract)

defineExpose({
  root,
  transform
})
</script>

<style lang="scss">
.router-panel {
  &__button {
    top: 50%;
    position: absolute;
    transform: translateY(-50%);

    &--prev { left: 20px; }
    &--next { right: 20px; }
  }

  &__close {
    top: 20px;
    left: 20px;
    position: absolute;
  }

  &__details {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 200px;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-flow: row wrap;
    padding: 0 20px;
    z-index: 1;

    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 500px;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(black, 0), rgba(black, .8));
      pointer-events: none;
      z-index: -1;
    }

    & > .g-text {
      width: 100%;
      &--subheading { margin: 0; }
    }
  }

  @include responsive(desktop) {
    &__details {
      padding: 0 40px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .2s ease, transform .3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>
