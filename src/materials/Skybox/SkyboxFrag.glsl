varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec3 skyColor = vec3(1., 0., 0.);
  vec3 groundColor = vec3(0., 0., 0.);

  float fog = vWorldPosition.y;
  fog += 50.;
  fog /= 60.;
  fog = clamp(fog, 0., 1.);

  vec3 color = mix(groundColor, skyColor, fog);

  gl_FragColor = vec4(color, 1.);
}
