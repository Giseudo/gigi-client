import { ref } from 'vue'
import { ShaderMaterial, Color, AdditiveBlending } from 'three'
import { useTime } from '@/store'
import fragmentShader from './StripesFrag.glsl?raw'
import vertexShader from './StripesVert.glsl?raw'

export default class StripesShaderMaterial extends ShaderMaterial {
  constructor (params = {}) {
    const { margin, fade, speed, color } = params
    const { time } = useTime()

    super({
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uColor: ref(new Color(color || 0xffffff)),
        uTime: time,
        uFade: ref(fade || .5),
        uMargin: ref(margin || .25),
        uSpeed: ref(speed || .25),
      }
    })
  }
}
