varying vec2 vUv;
varying vec3 vWorldNormal;
uniform vec3 uBaseColor;

uniform float uTime;

void main() {
  vec3 N = normalize(vWorldNormal);
  float shadow = dot(N, vec3(0., -1., 0.)) * .2;
  shadow += dot(N, vec3(-1., 0, 0.)) * .1;
  shadow += dot(N, vec3(0., 0, -1.)) * .05;

  vec3 blend = uBaseColor - shadow;

  gl_FragColor = vec4(blend, 1.0);
}
