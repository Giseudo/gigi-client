import { Color, ShaderMaterial, TextureLoader } from 'three'
import { useGame } from '@/store'
import fragmentShader from './PodFaceFrag.glsl?raw'
import vertexShader from './PodFaceVert.glsl?raw'

export default class PodFaceShaderMaterial extends ShaderMaterial {
  constructor (params) {
    const { time } = useGame()

    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        uTime: { value: time },
        uBaseColor: {
          type: 'v3',
          value: new Color(params?.color || 'cyan')
        },
        uFaceTex: {
          type: 't',
          value: null
        }
      }
    })

    const loader = new TextureLoader()

    loader.load(params.faceTexture, texture => {
      this.uniforms.uFaceTex.value = texture
    })
  }
}
