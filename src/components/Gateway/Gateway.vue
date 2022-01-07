<template>
  <Group ref="transform" :position="position" :rotation="rotation">
    <Sphere
      :width-segments="32"
      :height-segments="32"
      :position="{ x: 0, y: 0, z: 0 }"
      :scale="{ x: radius, y: radius, z: radius }"
    >
      <BasicMaterial color="#261c1c" />
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

    <RedirectRoute :radius="radius" />
  </Group>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { initGateway } from './'
import { Vector3 } from 'three'
import anime from 'animejs'

export default defineComponent({
  name: 'Gateway',
  
  components: {
    Port: defineAsyncComponent(() => import('./Port')),
    RedirectRoute: defineAsyncComponent(() => import('./RedirectRoute'))
  },

  emits: [ 'port-accessed' ],

  setup () {
    const { setActivePort, transform } = initGateway()

    return {
      transform,
      setActivePort
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
    redirectRouteMaterial: null,
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
            easing: 'easeInOutCubic',
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
  }
})
</script>
