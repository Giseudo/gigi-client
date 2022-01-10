<template>
  <Group ref="transform">
    <Cylinder
      :radius-top=".5"
      :radius-bottom=".5"
      :height="20"
      :position="{ y: 10.5 }"
    >
      <BlockMaterial color="#505050" />
    </Cylinder>

    <Sphere ref="core" :radius=".2">
      <BlockMaterial color="#505050" />
    </Sphere>

    <Cylinder
      :radius-top=".5"
      :radius-bottom=".5"
      :height="20"
      :position="{ y: -10.5 }"
    >
      <BlockMaterial color="#505050" />
    </Cylinder>

    <Ring ref="path"
      :outer-radius="radius"
      :inner-radius="radius - .5"
      :theta-segments="64"
      :phi-segments="1"
      :rotation="{ x: -Math.PI / 2, y: 0, z: 0 }"
    >
      <ShaderMaterial :props="pathMaterialProps" />
    </Ring>

    <Service ref="services"
      v-for="(service, index) in services"
      :key="index"
      :port="service.port"
      :position="getServicePosition(index)"
      @click="$emit('service-access', service)"
    />
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { BlockMaterial } from '@/materials'
import { useGame } from '@/store'
import Service from './Service'

import fragmentShader from './PathFrag.glsl'
import vertexShader from './PathVert.glsl'

export default defineComponent({
  name: 'Gateway',

  emits: [ 'service-access' ],

  components: {
    Service,
    BlockMaterial,
  },
  
  setup () {
    const { time } = useGame()
    const transform = ref(null)  
    const pathMaterialProps = {
      fragmentShader,
      vertexShader,
      transparent: true,
      uniforms: { uTime: time }
    }

    return {
      transform,
      pathMaterialProps
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
      const x = Math.sin((Math.TAU / count) * index) * (this.radius - 1.5)
      const y = -.75
      const z = Math.cos((Math.TAU / count) * index) * (this.radius - 1.5)

      return { x, y, z}
    }
  }
})
</script>
