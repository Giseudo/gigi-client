<template>
  <ShaderMaterial :props="materialProps" />
</template>

<script>
import { defineComponent } from 'vue'
import { Color } from 'three'
import { useGame } from '@/store'
import fragmentShader from './LoaderFrag.glsl'
import vertexShader from './LoaderVert.glsl'

export default defineComponent({
  name: 'LoaderMaterial',
  
  setup (props) {
    const { time } = useGame()

    return {
      materialProps: {
        fragmentShader,
        vertexShader,
        transparent: true,
        depthWrite: false,
        premultipliedAlpha: true,
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
      default: 'red'
    }
  }
})
</script>
