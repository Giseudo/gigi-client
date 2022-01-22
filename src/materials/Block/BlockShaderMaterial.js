import { Color, ShaderMaterial } from 'three'
import { useGame } from '@/store'
import fragmentShader from './BlockFrag.glsl?raw'
import vertexShader from './BlockVert.glsl?raw'

export default class BlockShaderMaterial extends ShaderMaterial {
  constructor (params) {
    const { time } = useGame()

    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        uTime: time,
        uDisplace: {
          type: 'v3',
          value: params?.displace || { x: 0, y: 0, z: 0 }
        },
        uBaseColor: {
          type: 'v3',
          value: new Color(params?.color || 'darkgrey')
        }
      }
    })
  }
}
