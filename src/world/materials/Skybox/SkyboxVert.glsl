varying vec2 vUv;
varying vec3 vWorldPosition;

void main(){
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;

  vUv = uv;
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
