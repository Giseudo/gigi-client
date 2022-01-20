<template>
  <ShaderMaterial :props="materialProps">
    <Texture
      uniform="uMainTex"
      :src="texture"
      @load="onLoad"
    />
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

  emits: [ 'load' ],
  
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
          uFade: { value: 1. },
          uBaseColor: { value: new Color(props.color) }
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
  },

  methods: {
    onLoad (texture) {
      this.$emit('load', texture)
    }
  }
})
</script>
