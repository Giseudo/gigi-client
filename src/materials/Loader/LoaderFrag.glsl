varying vec2 vUv;
uniform vec3 uBaseColor;

uniform float uTime;

#define PI 3.1415926538

void main() {
  vec2 center = vUv - vec2(0.5, 0.5);
  float radius = length(center);
  float angle = atan(center.y, center.x);
  vec2 polar = vec2(2. * radius, angle * .5 / PI + .5);

  float line = polar.y;
  line = fract(line + uTime);
  line = step(0.5, line);

  float circle = polar.x;
  circle = step(.5, circle) - step(.6, circle);

  float alpha = circle * line;

  gl_FragColor = vec4(uBaseColor * alpha, alpha);
}
