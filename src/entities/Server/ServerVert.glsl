varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldNormal;

void main () {
  vUv = uv;
  vNormal = normal;
  vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
