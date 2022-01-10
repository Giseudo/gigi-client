varying vec2 vUv;
uniform vec3 uBaseColor;

uniform sampler2D uMainTex;
uniform float uTime;

float frac(float v) {
  return v - floor(v);
}

float noise(vec2 co){
  return fract(sin(dot(co.xy,vec2(1.0,0.42829))) * 51126.88915);
}

void main() {
  float scanline = sin(vUv.y * 200.0 - uTime * 40.0);
  float randomizer = noise(vec2(uTime, uTime * 8.0));
  float scannoise = randomizer * 0.002;
  vec2 offset = vec2(scannoise * scanline, 0.0);

  vec2 uv = fract(vUv + offset);
  vec3 baseColor = texture2D(uMainTex, uv).xyz;

  baseColor -= sin(uTime * 100. + fract(vUv.y * 2.)) * .02;
  baseColor -= scanline * .02;

  float alpha = 1. - scanline * .5;

  gl_FragColor = vec4(baseColor, alpha);
}
