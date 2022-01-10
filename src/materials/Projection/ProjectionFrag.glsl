varying vec2 vUv;
uniform vec3 uBaseColor;

uniform sampler2D uMainTex;
uniform float uTime;

void main() {
  vec3 baseColor = texture2D(uMainTex, vUv).xyz;

  gl_FragColor = vec4(baseColor, 1.0);
}
