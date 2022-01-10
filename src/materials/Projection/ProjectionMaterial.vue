<template>
  <ShaderMaterial :props="materialProps">
    <Texture :src="texture" uniform="uMainTex"/>
  </ShaderMaterial>
</template>

<script>
import { defineComponent } from 'vue'
import { Color } from 'three'
import { useGame } from '@/store'
import fragmentShader from './ProjectionFrag.glsl'
import vertexShader from './ProjectionVert.glsl'

export default defineComponent({
  name: 'ProjectionMaterial',
  
  setup (props) {
    const { time } = useGame()

    return {
      materialProps: {
        fragmentShader,
        vertexShader,
        uniforms: {
          uTime: time,
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

    texture: {
      type: String,
      default: '/images/megaman-legends.jpg'
    }
  }
})
</script>
