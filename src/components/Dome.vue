<template>
  <Group ref="transform" :rotation="rotation">
    <Sphere
      :width-segments="32"
      :height-segments="32"
      :position="{ x: 0, y: 0, z: 0 }"
      :scale="{ x: radius, y: radius, z: radius }"
    >
      <BasicMaterial color="#261c1c" />
    </Sphere>

    <Group ref="ports" :key="port.number" v-for="port in ports">
      <Gateway
        :position="{ x: 0, y: 0, z: radius + .5 }"
        :number="port.number"
        :is-disabled="port.disabled"
        @click="onAccessPort(port.number)"
      />
    </Group>
  </Group>
</template>

<script>
import { defineComponent, ref, provide } from 'vue'
import { Vector3, BufferGeometry, Float32BufferAttribute, Line, EllipseCurve } from 'three'
import Gateway from '@/components/Gateway'
import LineRouteMaterial from '../materials/LineRoute'
import anime from 'animejs'

export default defineComponent({
  name: 'Dome',
  
  components: {
    Gateway
  },

  emits: [ 'port-accessed' ],

  setup () {
    const transform = ref(null)
    const gateway = ref({
      activePort: null
    })

    provide('gateway', gateway)

    return {
      transform,
      gateway
    }
  },

  props: {
    radius: {
      type: Number,
      default: 4
    }
  },

  data: () => ({
    font: require('../assets/fonts/V5XtenderRegular.font').default,
    rotation: { x: 0, y: 0, z: 0 },
    redirectRouteMaterial: null,
    ports: [
      { number: 80, disabled: false },
      { number: 443, disabled: false },
      { number: 8080, disabled: true },
      { number: 40, disabled: true },
    ]
  }),

  mounted () {
    const { ports } = this.$refs

    ports.forEach((port, i) => {
      const number = this.ports[i].number

      if (number === 443) {
        port.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(45))
        port.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-45))
      }

      if (number === 8080) {
        port.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(-90))
        port.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(30))
      }

      if (number === 40) {
        port.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(180))
        port.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-15))
      }
    })

    this.createRedirectRoute()
  },

  methods: {
    onAccessPort (port) {
      this.gateway.activePort = port

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
            easing: 'easeInOutCubic',
          })

        anime({
          targets: this.redirectRouteMaterial.uniforms.time,
          value: 1.0,
          duration: 2000,
          delay: 1000,
          easing: 'linear',
          complete: () => {
            this.redirectRouteMaterial.uniforms.time.value = 0
            this.gateway.activePort = 443
          }
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

      this.$emit('port-accessed', port)
    },

    createRedirectRoute () {
      const curve = new EllipseCurve(
        0, 0,
        this.radius + 1, this.radius + 1,
        .1, (Math.PI / 3) - .1,
        false,
        0
      )
      const points = curve.getPoints(8)
      const uvs = new Float32Array(
        points.reduce((acc, _, i) => ([
          ...acc,
          ...[ Math.lerp(0, 1, i / 8), 0 ],
        ]), [])
      )

      const geometry = new BufferGeometry().setFromPoints(points)
      geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

      const material = new LineRouteMaterial({
        transparent: true,
        linewidth: 3,
        depthWrite: false
      })

      const ellipse = new Line(geometry, material)
      ellipse.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(-90))
      ellipse.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-90 + 45 + 10))

      this.transform.add(ellipse)
      this.redirectRouteMaterial = material
    }
  }
})
</script>
