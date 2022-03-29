varying vec2 vUv;
uniform vec3 uColor;
uniform float uTime;
uniform float uSpeed;
uniform float uFade;

void main() {
  float alpha = 1.;

  float fade = pow(abs(vUv.x - .5) - .5, uFade);
  fade *= 5.;
  fade = clamp(fade, 0., 1.);

  float stripes = (vUv.y / 10.) - uTime * uSpeed;
  stripes += vUv.x;
  stripes *= 6.;
  stripes = fract(stripes);
  stripes = stripes < .5 ? 1. : 0.;

  float flickering = sin(uTime * 50.) * .5 + .5;
  flickering *= .2;

  alpha *= stripes;
  alpha -= flickering;
  alpha *= fade;

  gl_FragColor = vec4(uColor, alpha);
}

