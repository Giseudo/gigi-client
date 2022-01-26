<template>
  <div class="g-dialogue" :class="classes">
    <div class="g-dialogue__container">
      <div class="g-dialogue__choices" v-if="choices.length > 1">
        <span ref="cursor" class="g-dialogue-cursor" />

        <button
          ref="choices"
          v-for="(choice, index) in choices"
          class="g-dialogue__choice"
          :class="{ 'g-dialogue__choice--selected': index === active }"
          :key="index"
          @click="onOptionClick(index)"
          @mouseenter="onOptionSelect(index)"
          @focus="onOptionSelect(index)"
        >
          <span class="g-dialogue-text g-dialogue-text--choice">
            {{ choice }}
          </span>
        </button>
      </div>

      <div class="g-dialogue__message" @click="onMessageClick">
        <span class="g-dialogue-text g-dialogue-text--subhead">
          {{ speaker }}:
        </span>

        <span class="g-dialogue-text g-dialogue-text--body">
          {{ text }}
        </span>

        <span class="g-dialogue__arrow" v-if="!choices.length" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import anime from 'animejs'

export default defineComponent({
  emits: [ 'continue' ],

  computed: {
    classes () {
      return {
        'g-dialogue--has-choices': this.choices.length > 0
      }
    }
  },

  props: {
    speaker: {
      type: String,
      default: 'undefined'
    },

    text: {
      type: String,
      default: 'Amet incidunt ex nesciunt rerum esse quibusdam? Laudantium accusamus dolorum quasi officia temporibus.'
    },

    choices: {
      type: Array,
      default: () => ([])
    }
  },

  watch: {
    active (index) {
      if (!this.choices.length) return

      const { cursor, choices } = this.$refs
      const choice = choices[index]
      const height = 44
      const rectA = choice.getBoundingClientRect()
      const rectB = choice.parentNode.getBoundingClientRect()
      const offset = (rectA.top - rectB.top) + (height / 2)
      const selectedClass = 'g-dialogue__choice--selected'

      choices.forEach(choice => choice.classList.remove(selectedClass))
      choice.classList.add(selectedClass)

      anime({
        targets: cursor,
        top: `${offset}px`,
        duration: 150,
        easing: 'easeOutQuad'
      })
    }
  },

  data: () => ({
    active: 0
  }),

  methods: {
    onOptionClick (index) {
      this.$emit('continue', index)
    },

    onOptionSelect (index) {
      this.active = index
    },

    onMessageClick () {
      this.$emit('continue', 0)
    }
  }
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

@font-face{
    font-family: 'Source Code Variable';
    font-weight: 200 900;
    font-style: normal;
    font-stretch: normal;
    src: url('/fonts/SourceCodeVariable-Roman.ttf.woff2') format('woff2'),
         url('/fonts/SourceCodeVariable-Roman.ttf.woff') format('woff'),
         url('/fonts/SourceCodeVariable-Roman.ttf') format('truetype');
}

@font-face{
    font-family: 'Source Code Variable';
    font-weight: 200 900;
    font-style: italic;
    font-stretch: normal;
    src: url('/fonts/SourceCodeVariable-Italic.ttf.woff2') format('woff2'),
         url('/fonts/SourceCodeVariable-Italic.ttf.woff') format('woff'),
         url('/fonts/SourceCodeVariable-Italic.ttf') format('truetype');
}

.g-dialogue {
  // transform-style: preserve-3d;
  // transform: perspective(500px) rotateX(10deg);
  // transform-origin: 50% 100%;

  &__container {
    margin: auto;
    max-width: 500px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    position: relative;
  }

  &__choices {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    max-width: 250px;

    .g-dialogue-cursor {
      position: absolute;
      top: 22px;
      left: -30px;
      animation-name: cursor;
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }
  }

  &__choice {
    position: relative;
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: rgba(black, .5);
    border: 0;
    text-align: left;
    cursor: pointer;

    &:before {
      content: "";
      position: absolute;
      left: 12px;
      top: 22px;
      height: 10px;
      width: 0%;
      background: rgba(white, .2);
      transition: .2s ease-out width;
    }

    &--selected {
      &:before { width: 75%; }
    }
  }

  &__message {
    flex: 1 100%;
    padding: 20px;
    padding-bottom: 40px;
    padding-left: 40px;
    position: relative;
    background-color: rgba(black, .5);
    cursor: pointer;

    &:after {
      content: "_";
      color: white;
      font-family: 'Source Code Variable';
      font-weight: 800;
      font-size: 14px;
      animation: underscore;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: steps(2, jump-none);
    }

    .g-dialogue-text {
      &--subhead {
        align-self: flex-start;
        transform: translateX(-20px);
      }
    }
  }

  &__arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
    bottom: 20px;
    right: 20px;
    animation-name: arrow;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  &--has-choices {
    .g-dialogue {
      &__arrow { display: none; }
    }
  }

  @keyframes arrow {
    0% { transform: translateY(0px); opacity: 1; }
    50% { transform: translateY(-5px); opacity: 0.5; }
    100% { transform: translateY(0px); opacity: 1; }
  }

  @keyframes cursor {
    0% { transform: translateX(0px) rotateZ(-45deg); }
    50% { transform: translateX(-5px) rotateZ(-45deg); }
    100% { transform: translateX(0px) rotateZ(-45deg); }
  }

  @keyframes selected-choice {
    0% { background-color: rgba(white, 1); }
    100% { background-color: rgba(black, .5); }
  }

  @keyframes underscore {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
}

.g-dialogue-text {
  color: white;
  font-family: 'Source Code Variable';

  &--body {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 1px;
  }

  &--choice {
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 1px;
  }

  &--subhead {
    display: block;
    font-size: 16px;
    font-weight: 800;
    line-height: 24px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
}

.g-dialogue-cursor {
  width: 8px;
  height: 8px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotateZ(-45deg);
  transform-origin: 0% 0%;

  &:before {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    top: 50%;
    left: 50%;
    background: white;
    transform: translate(-4px, -4px);
  }
}
</style>
