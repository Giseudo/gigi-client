varying vec2 vUv;
uniform float time;
uniform vec3 color;

float frac(float v) {
  return v - floor(v);
}

void main() {
  float v = frac(vUv.x * 8.);
  float t = time;
  float start = step(vUv.x, (t * 2.) - .75);
  float end = step(v, t);
  float alpha = end - start;

  gl_FragColor = vec4(1, 1, 1, alpha);
}
