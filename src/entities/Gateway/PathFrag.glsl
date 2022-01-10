varying vec2 vUv;
uniform vec3 uBaseColor;

uniform float uTime;

void main() {
  float alpha = .2;
  vec3 baseColor = vec3(1, 1, 1);
  alpha -= sin(uTime * 80.) * .01;

  gl_FragColor = vec4(baseColor, alpha);
}
