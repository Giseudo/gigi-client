varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec3 skyColor = vec3(1., 0., 0.);
  vec3 groundColor = vec3(.6, .2, .2);

  float fog = vWorldPosition.y;
  fog += 300.;
  fog /= 300.;
  fog = clamp(fog, 0., 1.);

  float light = vWorldPosition.y;
  light /= 300.;
  light = clamp(light, 0., .3);

  vec3 color = mix(groundColor, skyColor, fog);

  color += light;

  gl_FragColor = vec4(color, 1.);
}
