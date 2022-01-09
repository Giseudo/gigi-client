attribute vec3 color;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;

uniform float uTime;
uniform vec3 uDisplace;

void main() {
  vec4 localPosition = vec4(position, 1.);
  vec4 worldPosition = modelMatrix * localPosition;

  if (uDisplace.x > 0.) worldPosition.x += sin(modelMatrix[0].x * 20. + uTime * .5) * uDisplace.x;
  if (uDisplace.y > 0.) worldPosition.z += sin(modelMatrix[0].x * 20. + uTime * .5) * uDisplace.y;
  if (uDisplace.z > 0.) worldPosition.y += sin(modelMatrix[0].x * 20. + uTime * .5) * uDisplace.z;

  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(normalMatrix * normal);

  gl_Position = projectedPosition;
}
