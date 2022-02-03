varying vec2 vUv;
uniform vec3 uBaseColor;

uniform sampler2D uMainTex;
uniform float uTime;
uniform float uFade;

float frac(float v) {
  return v - floor(v);
}

float noise(vec2 co){
  return fract(sin(dot(co.xy, vec2(1.0, 0.42829))) * 51126.88915);
}

void main() {
  float scanline = sin(vUv.y * 500.0 - uTime * 10.0);
  float randomizer = noise(vec2(sin(uTime)));
  float scannoise = randomizer * 0.005;
  vec2 offset = vec2(scannoise * scanline, 0.0);

  vec2 uv = fract(vUv + offset);
  vec3 baseColor = texture2D(uMainTex, uv).xyz;

  baseColor -= sin(uTime * 100. + fract(vUv.y * 2.)) * .02;
  baseColor -= scanline * .02;

  vec2 center = vec2(.5, .75);
  float vignet = 1. - distance(vUv, center);
  float alpha = 1.;

  if (uv.x > .99 || uv.x < .01) alpha = 0.;
  baseColor *= alpha;
  baseColor = mix(baseColor, vec3(.9), uFade * alpha);

  alpha *= vignet * 1.2;

  float fade = smoothstep(1., .5, vUv.y);
  alpha *= fade;
  
  alpha -= uFade;

  gl_FragColor = vec4(baseColor, alpha);
}
