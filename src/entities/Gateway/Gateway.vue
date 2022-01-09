<template>
  <Group ref="transform">
    <Cylinder
      :radius-top=".5"
      :radius-bottom=".5"
      :height="20"
      :position="{ y: 10.5 }"
    >
      <BlockMaterial />
    </Cylinder>

    <Sphere ref="core" :radius=".2">
      <BlockMaterial />
    </Sphere>

    <Cylinder
      :radius-top=".5"
      :radius-bottom=".5"
      :height="20"
      :position="{ y: -10.5 }"
    >
      <BlockMaterial />
    </Cylinder>

    <Ring ref="ring"
      :outer-radius="radius"
      :inner-radius="radius - .5"
      :theta-segments="64"
      :phi-segments="1"
      :rotation="{ x: -Math.PI / 2, y: 0, z: 0 }"
    >
      <BasicMaterial />
    </Ring>

    <Service ref="services"
      v-for="(service, index) in services"
      :key="index"
      :port="service.port"
      :position="getServicePosition(index)"
    />
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { BlockMaterial } from '@/materials'
import Service from './Service'

export default defineComponent({
  name: 'Gateway',

  components: {
    Service,
    BlockMaterial,
  },
  
  setup () {
    const transform = ref(null)  

    return {
      transform
    }
  },

  props: {
    radius: {
      type: Number,
      default: 8
    },
    services: {
      type: Array,
      default: () => ([
        { port: 7000 },
        { port: 2375 },
        { port: 5000 },
        { port: 3366 },
      ])
    }
  },

  mounted () {
    const { services, core } = this.$refs
    const up = new Vector3(0, 1, 0)

    for (let i = 0; i < services.length; i++) {
      const service = services[i].transform.group

      service.lookAt(core.mesh.position)
      service.rotateOnAxis(up, Math.PI)
    }
  },

  methods: {
    getServicePosition (index) {
      const count = this.services.length
      const x = Math.sin((Math.TAU / count) * index) * (this.radius - 1)
      const y = .5
      const z = Math.cos((Math.TAU / count) * index) * (this.radius - 1)

      return { x, y, z}
    }
  }
})
</script>
