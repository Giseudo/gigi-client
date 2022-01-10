varying vec2 vUv;
uniform vec3 uBaseColor;

uniform float uTime;

void main() {
  float baseAlpha = 1. - abs(vUv.x - .5);
  baseAlpha += .25;
  baseAlpha = max(baseAlpha, 1.);
  baseAlpha -= sin(uTime) * .25;
  baseAlpha *= .25;

  float borderA = step(.92, vUv.x);
  float borderB = step(.92, 1. - vUv.x);
  float border = (borderA + borderB) * .5;

  float alpha = baseAlpha + border;

  vec3 color = vec3(1, 1, 1);

  gl_FragColor = vec4(color, alpha);

}
