import { ShaderMaterial } from 'three'
import VertexShader from './LineRouteVert.glsl'
import FragmentShader from './LineRouteFrag.glsl'

export default class RouteLineMaterial extends ShaderMaterial {
  constructor(parameters) {
    super(parameters)

    this.vertexShader = VertexShader
    this.fragmentShader = FragmentShader

    this.uniforms.time = { value: 0.0 }
  }
}
