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

    <Ring ref="path"
      :outer-radius="radius"
      :inner-radius="radius - 1"
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
      :thumbnail="service.thumbnail"
      @click="$emit('access-service', service)"
    />
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3, RingBufferGeometry } from 'three'
import { BlockMaterial } from '@/materials'
import { useGame } from '@/store'
import Service from './Service'

import fragmentShader from './PathFrag.glsl?raw'
import vertexShader from './PathVert.glsl?raw'

export default defineComponent({
  name: 'Gateway',

  emits: [ 'access-service' ],

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
      depthWrite: false,
      blending: 2,
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
        { port: 7000, name: 'PHP' },
        { port: 2375, name: 'MongoDB' },
        { port: 5000, name: 'Frontend' },
        { port: 3366, name: 'MySQL' },
      ])
    },
    position: {
      type: [ Object, Vector3 ],
      default: () => ({ x: 0, y: 0, z: 0 })
    }
  },

  mounted () {
    const { services, core, path } = this.$refs
    const up = new Vector3(0, 1, 0)
    const target = core.mesh.position.clone()

    for (let i = 0; i < services?.length; i++) {
      const service = services[i].transform.group
      target.y = service.position.y

      service.lookAt(target)
      service.rotateOnAxis(up, Math.PI)
    }

    // FIXME move to another component
    const geo = new RingBufferGeometry(3, 5, 64)
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
      const x = Math.sin((Math.TAU / count) * index) * (this.radius - 1.75)
      const y = -.25
      const z = Math.cos((Math.TAU / count) * index) * (this.radius - 1.75)

      return { x, y, z}
    },
  }
})
</script>
