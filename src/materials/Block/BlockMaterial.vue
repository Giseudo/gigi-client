<template>
  <ShaderMaterial :props="materialProps" />
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3, Color } from 'three'
import { useGame } from '@/store'
import fragmentShader from './BlockFrag.glsl'
import vertexShader from './BlockVert.glsl'

export default defineComponent({
  name: 'BlockMaterial',
  
  setup (props) {
    const { time } = useGame()

    return {
      materialProps: {
        fragmentShader,
        vertexShader,
        uniforms: {
          uTime: time,
          uDisplace: {
            type: 'v3',
            value: props.displace
          },
          uBaseColor: {
            type: 'v3',
            value: new Color(props.color)
          }
        }
      }
    }
  },

  props: {
    color: {
      type: String,
      default: 'darkgrey'
    },

    displace: {
      type: [ Vector3, Object ],
      default: () => ({ x: 0, y: 0, z: 0 })
    }
  },
})
</script>
