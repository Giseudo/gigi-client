<template>
  <Group ref="transform" :rotation="rotation">
    <Sphere
      :width-segments="32"
      :height-segments="32"
      :position="{ x: 0, y: 0, z: 0 }"
      :scale="{ x: scale, y: scale, z: scale }"
    >
      <BasicMaterial color="#261c1c" />
    </Sphere>

    <Group ref="httpGate">
      <Text ref="text"
        text=":80"
        :position="{ x: -.5, y: 0, z: 4.5 }"
        :size=".5"
        :height="0"
        :font-src="font"
        @click="$emit('enter', 80)"
      >
        <BasicMaterial
          color="#ff0000"
          :props="{ opacity: .75, transparent: true }"
        />
      </Text>
    </Group>

    <Group ref="sslGate">
      <Text ref="text"
        text=":443"
        :position="{ x: -.75, y: 0, z: 4.5 }"
        :size=".5"
        :height="0"
        :font-src="font"
        @click="$emit('enter', 443)"
      >
        <BasicMaterial
          color="#ff0000"
          :props="{ opacity: .75, transparent: true }"
        />
      </Text>
    </Group>

    <Group ref="sshGate">
      <Text ref="text"
        text=":22"
        :position="{ x: -.5, y: 0, z: 4.5 }"
        :size=".5"
        :height="0"
        :font-src="font"
        @click="$emit('enter', 40)"
      >
        <BasicMaterial
          color="#ff0000"
          :props="{ opacity: .1, transparent: true }"
        />
      </Text>
    </Group>
  </Group>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Vector3 } from 'three'

export default defineComponent({
  name: 'Dome',
  
  emits: [ 'enter' ],

  setup () {
    const transform = ref(null)

    return {
      transform
    }
  },

  props: {
    scale: {
      type: Number,
      default: 4
    }
  },

  data: () => ({
    font: require('../assets/fonts/V5XtenderRegular.font').default,
    rotation: { x: 0, y: 0, z: 0 }
  }),

  mounted () {
    const { sslGate, sshGate } = this.$refs

    sslGate.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(30))
    sslGate.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(45))

    sshGate.group.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(180))
    sshGate.group.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-15))

  }
})
</script>
