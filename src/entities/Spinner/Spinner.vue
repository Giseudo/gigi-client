<template>
  <Transition v-on:leave="leave">
    <span v-show="isLoading">
      <Plane ref="transform" v-bind="$attrs" :scale="scale">
        <SpinnerMaterial />
      </Plane>
    </span>
  </Transition>
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3 } from 'three'
import SpinnerMaterial from './SpinnerMaterial'
import anime from 'animejs'

export default defineComponent({
  name: 'Spinner',

  components: {
    SpinnerMaterial
  },

  props: {
    scale: {
      type: [ Object, Vector3 ],
      default: () => ({ x: 1, y: 1, z: 1 })
    },

    isLoading: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    leave (_, done) {
      anime({
        targets: this.$refs.transform.mesh.scale,
        x: 0,
        y: 0,
        delay: 200,
        duration: 150,
        easing: 'easeInQuad',
        complete: () => done()
      })
    }
  }
})
</script>
