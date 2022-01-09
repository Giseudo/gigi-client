import { defineComponent } from 'vue'
import { Vector3, BufferGeometry, Float32BufferAttribute, Line, EllipseCurve } from 'three'
import { useServer } from './'
import LineRouteMaterial from '@/materials/LineRoute'
import anime from 'animejs'

export default defineComponent({
  name: 'RedirectRoute',

  props: {
    radius: {
      type: Number,
      default: 4
    }
  },

  setup () {
    const { transform, activePort, setActivePort } = useServer()

    return {
      parent: transform,
      activePort,
      setActivePort
    }
  },

  watch: {
    activePort (value) {
      if (value !== 80) return

      anime({
        targets: this.material.uniforms.time,
        value: 1.0,
        duration: 2000,
        delay: 2000,
        easing: 'linear',
        complete: () => {
          this.material.uniforms.time.value = 0
          this.setActivePort(443)
        }
      })
    }
  },

  data: () => ({
    material: null
  }),

  mounted () {
    this.init()
  },

  methods: {
    init () {
      const curve = new EllipseCurve(
        0, 0,
        this.radius + 1, this.radius + 1,
        .1, (Math.PI / 3) - .1,
        false,
        0
      )
      const pointCount = 4
      const points = curve.getPoints(pointCount)
      const uvs = new Float32Array(
        points.reduce((acc, _, i) => ([
          ...acc,
          ...[ Math.lerp(0, 1, i / pointCount), 0 ],
        ]), [])
      )

      const geometry = new BufferGeometry().setFromPoints(points)
      geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

      const material = new LineRouteMaterial({
        transparent: true,
        linewidth: 3,
        depthWrite: false
      })

      const ellipse = new Line(geometry, material)
      ellipse.rotateOnAxis(new Vector3(0, 1, 0), Math.radians(-90))
      ellipse.rotateOnAxis(new Vector3(1, 0, 0), Math.radians(-90 + 45 + 10))

      this.parent.add(ellipse)
      this.material = material
    }
  },

  render: () => []
})
