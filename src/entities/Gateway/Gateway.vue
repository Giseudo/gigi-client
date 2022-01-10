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
      :theta-segments="64 * 2"
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
      @toggle="onToggleService"
    />
  </Group>

  <span v-if="activeService" class="gateway__active-service">
    {{ activeService }}
  </span>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3, RingBufferGeometry } from 'three'
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

  data: () => ({
    activeService: null
  }),

  mounted () {
    const { services, core, path } = this.$refs
    const up = new Vector3(0, 1, 0)
    const target = core.mesh.position.clone()

    for (let i = 0; i < services.length; i++) {
      const service = services[i].transform.group
      target.y = service.position.y

      service.lookAt(target)
      service.rotateOnAxis(up, Math.PI)
    }

    // FIXME move to another component
    const geo = new RingBufferGeometry(3, 5, 64 * 2)
    const pos = geo.attributes.position
    const v3 = new Vector3()

    for (let i = 0; i < pos.count; i++){
      v3.fromBufferAttribute(pos, i)
      path.mesh.geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1)
    }
  },

  methods: {
    getServicePosition (index) {
      const count = this.services.length
      const x = Math.sin((Math.TAU / count) * index) * (this.radius - 1)
      const y = -.25
      const z = Math.cos((Math.TAU / count) * index) * (this.radius - 1)

      return { x, y, z}
    },

    onToggleService ({ active, port }) {
      this.activeService = active ? port : null
    }
  }
})
</script>

<style lang="scss">
.gateway {
  &__active-service {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 40px;
    color: white;
  }
}
</style>
