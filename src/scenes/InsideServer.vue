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
    >
      <BasicMaterial />
    </Ring>

    <Service ref="services"
      v-for="(service, index) in services"
      :key="index"
      :port="service.port"
      :position="getServicePosition(index)"
    />

    <Sphere :scale="{ x: 50, y: 50, z: 50 }">
      <SkyboxMaterial />
    </Sphere>
  </Group>

  <UserAgent ref="user" />

  <TouchStick @move="onTouchMove" />
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'
import { useGame, useInput, useNavigator } from '@/store'
import { BlockMaterial } from '@/materials/Block'
import UserAgent from '@/components/Navigator/UserAgent'
import TouchStick from '@/components/TouchStick'
import SkyboxMaterial from '@/materials/Skybox'
import Service from '@/components/Server/Service/Service'
import anime from 'animejs'

export default defineComponent({
  name: 'InsideServer',

  components: {
    UserAgent,
    Service,
    SkyboxMaterial,
    BlockMaterial,
    TouchStick
  },
  
  setup () {
    const transform = ref(null)  
    const { camera, renderer, deltaTime, time } = useGame()
    const { axis, setPrimaryAxis } = useInput()
    const { connectUserAgent } = useNavigator()

    return {
      transform,
      time,
      deltaTime,
      renderer,
      camera,
      axis,
      setPrimaryAxis,
      connectUserAgent,
    }
  },

  data: () => ({
    radius: 8,
    services: [
      { port: 7000 },
      { port: 2375 },
      { port: 5000 },
      { port: 3366 },
    ],
    displacement: 0
  }),

  mounted () {
    const { ring, user, core, services } = this.$refs

    this.connectUserAgent(user.transform.group)

    anime({
      targets: this.camera.position,
      z: 10,
      y: 3,
      duration: 1000,
      easing: 'easeOutQuad'
    })

    const up = new Vector3(0, 1, 0)

    for (let i = 0; i < services.length; i++) {
      services[i].transform.group.lookAt(core.mesh.position)
      services[i].transform.group.rotateOnAxis(up, Math.PI)
    }

    ring.mesh.rotation.x = -Math.PI / 2

    this.renderer.onBeforeRender(() => {
      this.displacement += this.axis.x

      const t = this.displacement * (this.deltaTime / 2)

      user.transform.group.position.x = Math.sin(t) * (this.radius - .25)
      user.transform.group.position.z = Math.cos(t) * (this.radius - .25)
      user.transform.group.rotation.copy(this.camera.rotation)

      this.camera.position.x = Math.sin(t) * (this.radius + 3)
      this.camera.position.z = Math.cos(t) * (this.radius + 3)
      this.camera.lookAt(
        new Vector3(Math.sin(t) * (this.radius - 2), 0, Math.cos(t) * (this.radius - 2))
      )
    })
  },

  methods: {
    getServicePosition (index) {
      const count = this.services.length
      const x = Math.sin((Math.TAU / count) * index) * (this.radius - 1)
      const y = .5
      const z = Math.cos((Math.TAU / count) * index) * (this.radius - 1)

      return { x, y, z}
    },

    onTouchMove (direction) {
      this.setPrimaryAxis(direction)
    }
  }
})
</script>
