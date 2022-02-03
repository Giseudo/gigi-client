varying vec2 vUv;
uniform vec3 uBaseColor;
uniform sampler2D uFaceTex;

uniform float uTime;

void main() {
  float columns = 3.;
  vec2 size = vec2(1. / columns);

  float indexX = 1.;
  float indexY = 0.;
  vec2 offset = vec2(size.x * indexX, -size.y * indexY);

  vec2 uv = vUv * size;
  uv.y = uv.y + size.y * (columns - 1.);
  uv += offset;

  float sdf = texture2D(uFaceTex, uv).a;
  float base = step(.5, sdf);
  float glow = sin(uTime * 10.);
  glow += 1.;
  glow /= 2.;
  glow *= .5;
  glow += .5;
  glow *= sdf;

  vec3 color = (base + glow) * uBaseColor;

  gl_FragColor = vec4(color, 1.0);
}
