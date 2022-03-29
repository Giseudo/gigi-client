import { defineComponent } from 'vue'
import { Color } from 'three'
import { MeshInjectionKey } from 'troisjs'
import BaseMaterial from 'troisjs/src/materials/Material'
import { StripesShaderMaterial } from './'

export default defineComponent({
  name: 'StripesMaterial',

  extends: BaseMaterial,

  inject: {
    mesh: MeshInjectionKey,
  },

  props: {
    color: {
      type: [ Number, String, Color ],
      default: 0xffff00
    },
    fade: {
      type: Number,
      default: .5
    },
    speed: {
      type: Number,
      default: .25
    }
  },

  methods: {
    createMaterial () {
      return new StripesShaderMaterial({
        color: this.color,
        fade: this.fade,
        speed: this.speed
      })
    }
  }
})
