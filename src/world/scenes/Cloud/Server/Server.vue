<template>
  <Group
    ref="transform"
    :position="position"
    :rotation="rotation"
  >
    <Sphere
      :width-segments="32"
      :height-segments="32"
      :position="{ x: 0, y: 0, z: 0 }"
      :scale="{ x: radius, y: radius, z: radius }"
      @pointer-enter="onPointerEnter"
      @pointer-leave="onPointerLeave"
    >
      <ShaderMaterial :props="gatewayMaterial" />
    </Sphere>

    <Group ref="httpPort">
      <Port
        :position="portOffset"
        :number="80"
        @click="onAccessPort(80)"
      />
    </Group>

    <Group ref="httpsPort">
      <Port
        :position="portOffset"
        :number="443"
        @click="onAccessPort(443)"
      />
    </Group>

    <Group ref="devPort">
      <Port is-disabled
        :position="portOffset"
        :number="8080"
        @click="onAccessPort(8080)"
      />
    </Group>

    <Group ref="sshPort">
      <Port is-disabled
        :position="portOffset"
        :number="22"
        @click="onAccessPort(22)"
      />
    </Group>

    <Route
      :radius="radius"
      @redirect="onRedirect"
    />
  </Group>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue'
import { initServer } from './'
import { usePointer, useGame, useWindow, useAlert } from '@/store'
import { Vector3, Color } from 'three'
import fragmentShader from './ServerFrag.glsl?raw'
import vertexShader from './ServerVert.glsl?raw'
import anime from 'animejs'

export default defineComponent({
  name: 'Gateway',
  
  components: {
    Port: defineAsyncComponent(() => import('./Port')),
    Route: defineAsyncComponent(() => import('./Route'))
  },

  emits: [ 'port-access' ],

  setup () {
    const { activePort, setActivePort, transform } = initServer()
    const { pointer, pointerDown, pointerMove, pointerUp } = usePointer()
    const { deltaTime, time } = useGame()
    const { isMobile } = useWindow()
    const { openAlert } = useAlert()
    const canDrag = ref(false)
    const isDragging = ref(false)
    const delta = { x: 0, y: 0 }

    const gatewayMaterial = {
      vertexShader,
      fragmentShader,
      uniforms: {
        time,
        color: { type: 'v3', value: new Color(0x261c1c) },
      },
    }

    const speed = computed(() => isMobile ? .05 : .2)

    pointerDown(() => {
      if (!canDrag.value) return

      isDragging.value = true
    })

    pointerMove(({ movementX, movementY }) => {
      if (!isDragging.value) return

      delta.x = movementY * deltaTime.value * speed.value
      delta.y = movementX * deltaTime.value * speed.value
 
      if (Math.abs(transform.value.rotation.x + delta.x) < Math.PI / 3)
        transform.value.rotation.x += delta.x

      transform.value.rotation.y += delta.y
    })

    pointerUp(() => {
      isDragging.value = false

      let t = 1

      const animate = () => {
        const step = Math.sin(t)
        t -= 0.05

        if (step <= 0 || isDragging.value) {
          delta.x = 0
          delta.y = 0

          return window.cancelAnimationFrame(animate)
        }

        if (Math.abs(transform.value.rotation.x + delta.x) < Math.PI / 3)
          transform.value.rotation.x += delta.x * step

        transform.value.rotation.y += delta.y * step

        window.requestAnimationFrame(animate)
      }

      animate()
    })

    return {
      openAlert,
      canDrag,
      isDragging,
      transform,
      activePort,
      setActivePort,
      pointer,
      deltaTime,
      gatewayMaterial,
      isMobile
    }
  },

  props: {
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0, z: 0 })
    },

    radius: {
      type: Number,
      default: 4
    }
  },

  data: (vm) => ({
    rotation: { x: 0, y: 0, z: 0 },
    portOffset: { x: 0, y: 0, z: vm.radius + .5 },
    ports: [
      { number: 80, disabled: false },
      { number: 443, disabled: false },
      { number: 8080, disabled: true },
      { number: 40, disabled: true },
    ]
  }),

  mounted () {
    const { httpsPort, devPort, sshPort } = this.$refs

    httpsPort.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(45))
    httpsPort.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-45))

    devPort.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(-90))
    devPort.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(30))

    sshPort.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(180))
    sshPort.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-15))
  },

  methods: {
    onAccessPort (port) {
      this.openAlert({
        title: `PORT: ${port}`,
        confirmText: 'Access',
        dark: true,
        cancel: true,

        onConfirm: (done) => {
          this.setActivePort(port)

          if (port === 80) {
            anime.timeline()
              .add({
                targets: this.transform.rotation,
                x: 0,
                y: 0,
                duration: 1000,
                easing: 'easeOutCubic',
              })
              .add({
                targets: this.transform.rotation,
                x: Math.radians(45),
                y: Math.radians(-45),
                duration: 3000,
                delay: 1000,
                easing: 'easeInOutCubic',
                complete: () => this.$emit('port-access', this.activePort)
              })
          }

          if (port === 443) {
            anime({
              targets: this.transform.rotation,
              x: Math.radians(45),
              y: Math.radians(-45),
              duration: 1000,
              easing: 'easeInOutCubic'
            })
          }

          this.$emit('port-access', this.activePort)

          done()
        }
      })
    },

    onRedirect () {
      this.setActivePort(443)
    },

    onPointerEnter () {
      this.canDrag = true

      if (this.isMobile) this.isDragging = true
    },

    onPointerLeave () {
      this.canDrag = false
    }
  }
})
</script>
