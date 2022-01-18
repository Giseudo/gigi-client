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
      @toggle="onToggleService($event, service)"
    />
  </Group>

  <transition name="fade">
    <span v-if="activeService" class="gateway__active-service">
      {{ activeService.name }}
    </span>
  </transition>

  <button
    class="gateway__arrow gateway__arrow--left"
    @click="onPrevious"
  >
    Prev
  </button>

  <button
    class="gateway__arrow gateway__arrow--right"
    @click="onNext"
  >
    Next
  </button>
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

  emits: [ 'access-service', 'toggle-service', 'previous', 'next' ],

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

  data: () => ({
    activeService: null,
    previousService: null
  }),

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

    onToggleService ({ active }, service) {
      this.previousService = service
      this.activeService = active ? service : null

      this.$emit('toggle-service', this.activeService)
    },

    onPrevious () {
      const currentIndex = this.services.indexOf(this.previousService)
      const prevIndex = Math.mod(currentIndex - 1, this.services.length)
      const service = this.services[prevIndex]

      this.$emit('previous', service)
    },

    onNext () {
      const currentIndex = this.services.indexOf(this.previousService)
      const nextIndex = Math.mod(currentIndex + 1, this.services.length)
      const service = this.services[nextIndex]

      this.$emit('next', service)
    }
  }
})
</script>

<style lang="scss">
.gateway {
  &__active-service {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    font-size: 32px;
    letter-spacing: 3px;
    font-family: Helvetica, Arial;
    color: white;
    text-align: center;
    text-transform: lowercase;
    font-weight: 600;
    background: linear-gradient(to bottom, rgba(black, .7) 0%, rgba(black, 0) 100%);
    padding: 40px 0 120px 0;
    pointer-events: none;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    background: rgba(black, .5);
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    cursor: pointer;

    &--left { left: 20px; }
    &--right { right: 20px; }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
