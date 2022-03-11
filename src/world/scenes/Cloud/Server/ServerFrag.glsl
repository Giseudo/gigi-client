varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldNormal;

uniform float time;
uniform vec3 color;

float frac(float v) { return v - floor(v); }

void main() {
  float t = (time / 2.);
  float y = frac(t + vNormal.y * 6.);
  float l = ((sin(time * 60.) * .5) + .5) * .1;
  float z = pow(.02, vWorldNormal.z);

  y += l;
  y -= .9;
  y = clamp(y, 0., 1.);

  vec3 linesCol = vec3(1., 0., 0.);
  vec3 blend = (y + z) * linesCol;

  gl_FragColor = vec4(blend, 1.0);
}
