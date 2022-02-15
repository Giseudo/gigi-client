<template>
  <div class="g-touch-stick" :class="classes">
    <div
      class="g-touch-stick__background"
      :style="{ left: `${origin.x}px`, top: `${origin.y}px`, color: 'white' }"
    >
      <span
        class="g-touch-stick__handle"
        :style="{
          transform: `translate(
            ${direction.x * 100 / 2}px,
            ${-direction.y * 100 / 2}px
          )`
        }"
      />
    </div>

    <span
      class="g-touch-stick__touch"
      :style="{ left: `${touch.x}px`, top: `${touch.y}px` }"
    >
    </span>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { usePointer } from '@/store'
import { Vector2 } from 'three'

export default {
  name: 'GTouchStick',

  setup (_, { emit }) {
    const { pointerDown, pointerMove, pointerUp } = usePointer()
    const isDragging = ref(false)
    const origin = new Vector2()
    const direction = new Vector2()
    const touch = ref(new Vector2())

    pointerDown((event) => {
      origin.set(event.pageX, event.pageY)
      touch.value.copy(origin)
      isDragging.value = true
    })

    pointerMove((event) => {
      if (!isDragging.value) return

      touch.value.set(event.pageX, event.pageY)

      const { x, y } = origin.clone().sub(touch.value).normalize()

      direction.set(-x, y)

      emit('move', direction)
    })

    pointerUp(() => {
      direction.set(0, 0)
      isDragging.value = false

      emit('move', direction)
    })

    return {
      isDragging,
      origin,
      touch,
      direction
    }
  },

  computed: {
    classes () {
      return {
        'g-touch-stick--is-dragging': this.isDragging
      }
    }
  },

  methods: {
    /*
    // TODO Where this belongs?
    getOrientedAxis (direction) {
      if (!this.camera) return direction

      const right = new Vector3(1, 0, 0)
        .applyQuaternion(this.camera.quaternion)
      right.y = 0
      right.normalize()

      const forward = new Vector3(0, 0, -1)
        .applyQuaternion(this.camera.quaternion)
      forward.y = 0
      forward.normalize()

      return right.multiplyScalar(direction.x)
        .add(forward.multiplyScalar(direction.y))
    }
    */
  }
}
</script>

<style lang="scss">
.g-touch-stick {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity .2s ease-in-out;
  pointer-events: none;
  overflow: hidden;
  z-index: 20;

  &__background {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid white;
  }

  &__handle {
    top: 50%;
    left: 50%;
    margin-left: calc(-50px / 2);
    margin-top: calc(-50px / 2);
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 75px;
    &:before {
      content: "";
      position: absolute;
      background: rgba(white, 1);
      width: 40%;
      height: 40%;
      border-radius: 75px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &__touch {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background: rgba(white, .1);
    position: absolute;
    transform: translate(-50%, -50%);
  }

  &--is-dragging { opacity: 1; }
}
</style>
