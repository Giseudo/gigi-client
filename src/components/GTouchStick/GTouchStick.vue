<template>
  <div class="g-touch-stick" :class="classes">
    <div
      class="g-touch-stick__background"
      :style="{ left: `${origin.x}px`, top: `${origin.y}px` }"
    >
      <span
        class="g-touch-stick__handle"
        :style="{ transform: `translate(${direction.x * 100 / 2}px, ${-direction.y * 100 / 2}px)` }"
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
import { usePointer } from '@/store'
import { Vector2 } from 'three'

export default {
  name: 'GTouchStick',

  data: () => ({
    isDragging: false,
    direction: new Vector2(),
    origin: new Vector2(),
    touch: new Vector2()
  }),

  setup () {
    const { subscribe, unsubscribe } = usePointer()

    return {
      subscribe, unsubscribe
    }
  },

  computed: {
    classes () {
      return {
        'g-touch-stick--is-dragging': this.isDragging
      }
    }
  },

  mounted () {
    this.subscribe('pointer-down', this.onTouchStart)
    this.subscribe('pointer-move', this.onTouchMove)
    this.subscribe('pointer-up', this.onTouchEnd)
  },

  unmounted () {
    this.unsubscribe('pointer-down', this.onTouchStart)
    this.unsubscribe('pointer-move', this.onTouchMove)
    this.unsubscribe('pointer-up', this.onTouchEnd)
  },

  methods: {
    onTouchStart ({ message: event }) {
      this.origin.set(event.pageX, event.pageY)
      this.touch.copy(this.origin)
      this.isDragging = true
    },

    onTouchMove ({ message: event }) {
      if (!this.isDragging) return

      this.touch.set(event.pageX, event.pageY)

      this.direction = this.origin.clone().sub(this.touch).normalize()
      this.direction.x *= -1

      this.$emit('move', this.direction)
    },

    onTouchEnd () {
      this.direction.set(0, 0)
      this.isDragging = false
      this.$emit('move', this.direction)
    }
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
