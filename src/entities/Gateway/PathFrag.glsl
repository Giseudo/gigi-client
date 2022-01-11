varying vec2 vUv;
uniform vec3 uBaseColor;

uniform float uTime;

void main() {
  float baseAlpha = 1. - abs(vUv.x - .5);
  baseAlpha = pow(baseAlpha, 4.);
  baseAlpha -= sin(uTime * 2.) * .1;
  baseAlpha *= .75;

  float borderA = step(.92, vUv.x);
  float borderB = step(.92, 1. - vUv.x);
  float border = (borderA + borderB) * .5;

  float alpha = baseAlpha;

  vec3 color = vec3(1, .5, .75);
  color *= alpha;

  gl_FragColor = vec4(color, alpha);

}
