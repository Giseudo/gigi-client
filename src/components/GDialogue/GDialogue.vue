<template>
  <div class="g-dialogue" :class="classes">
    <div class="g-dialogue__container">
      <transition name="choices" mode="out-in">
        <div class="g-dialogue__choices" v-if="showChoices">
          <span ref="cursor" class="g-dialogue-cursor" />

          <button ref="choices"
            v-for="(choice, index) in choices"
            class="g-dialogue-choice"
            :class="{ 'g-dialogue-choice--selected': index === activeChoice }"
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
      </transition>

      <div class="g-dialogue__message" @click="onMessageClick">
        <span class="g-dialogue-text g-dialogue-text--subhead">
          {{ speaker }}:
        </span>

        <span v-typewrite="{ text, skip, complete: onTypewriteEnd }"
          class="g-dialogue-text g-dialogue-text--body"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Typewrite } from '../../directives/Typewrite'
import anime from 'animejs'

export default defineComponent({
  emits: [ 'continue' ],

  directives: { Typewrite },

  computed: {
    showUnderscore () {
      return !this.showChoices // this.isTyping || !this.isTyping && this.choices.length <= 1
    },

    /*
    showChoices () {
      return !this.isTyping && this.choices.length > 1
    },
    */

    classes () {
      return {
        'g-dialogue--show-underscore': this.showUnderscore,
        'g-dialogue--show-choices': this.showChoices,
        'g-dialogue--perspective': this.perspective,
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
    },

    speed: {
      type: Number,
      default: 50
    },

    perspective: {
      type: Boolean,
      default: false
    },
  },

  watch: {
    activeChoice (index) {
      if (!this.showChoices) return

      const { cursor, choices } = this.$refs
      const choice = choices[index]

      if (!choice) return

      const height = 44
      const rectA = choice.getBoundingClientRect()
      const rectB = choice.parentNode.getBoundingClientRect()
      const offset = (rectA.top - rectB.top) + (height / 2)
      const selectedClass = 'g-dialogue-choice--selected'

      choices.forEach(choice => choice.classList.remove(selectedClass))
      choice.classList.add(selectedClass)

      anime({
        targets: cursor,
        top: `${offset}px`,
        duration: 150,
        easing: 'easeOutQuad'
      })
    },

    text () {
      this.skip = false
      this.isTyping = true
    },
  },

  data: () => ({
    activeChoice: 0,
    isTyping: true,
    skip: false,
    showChoices: false
  }),

  methods: {
    onOptionClick (index) {
      if (this.isTyping) return

      this.choose(index)
    },

    onOptionSelect (index) {
      this.select(index)
    },

    onMessageClick () {
      if (this.showChoices) return

      this.activeChoice = 0
      this.confirm()
    },

    onTypewriteEnd () {
      this.isTyping = false
      this.skip = false
    },

    confirm () {
      if (this.isTyping)
        return this.skip = true

      if (!this.showChoices && this.choices.length > 1)
        return this.showChoices = true

      this.choose()
    },

    choose (index) {
      setTimeout(() => this.activeChoice = 0, 400)

      this.showChoices = false

      this.$emit('continue', index ?? this.activeChoice)
    },

    select (index) {
      if (index < 0) return
      if (index > this.choices.length - 1) return

      this.activeChoice = index
    },

    selectPrevious () {
      this.select(this.activeChoice - 1)
    },

    selectNext () {
      this.select(this.activeChoice + 1)
    }
  }
})
</script>

<style lang="scss">
.g-dialogue {
  &__container {
    margin: auto;
    max-width: 600px;
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
    max-width: 300px;

    .g-dialogue-cursor {
      position: absolute;
      top: 22px;
      left: -30px;
      animation-name: cursor;
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }
  }

  &__message {
    flex: 1 100%;
    padding: 15px;
    padding-bottom: 20px;
    position: relative;
    background-color: rgba(black, .5);
    min-height: 100px;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    @include responsive(desktop) {
      padding: 20px;
      padding-bottom: 40px;
    }
  }

  &--show-choices {
    .g-dialogue {
      &__arrow { display: none; }
    }
  }

  &--show-underscore {
    .g-dialogue {
      &__message {
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
      }
    }

    &--perspective {
      transform-style: preserve-3d;
      transform: perspective(500px) rotateX(10deg);
      transform-origin: 50% 100%;
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

  .choices-enter-active,
  .choices-leave-active {
    transition: opacity .2s ease, transform .2s ease;

    .g-dialogue-choice {
      transition: opacity .2s;

      &--selected { transition: opacity .2s .2s, transform .2s ease; }
    }

    .g-dialogue-cursor {
      transition: opacity .2s;
    }
  }

  .choices-leave-active {
    transition: opacity .2s ease .2s, transform .2s ease;
  }

  .choices-enter-from {
    opacity: 0;
    transform: translateX(-20px);
  }

  .choices-leave-to {
    .g-dialogue-choice {
      opacity: 0;

      &--selected { transform: scale(1.1); }
    }

    .g-dialogue-cursor {
      opacity: 0;
    }
  }
}

.g-dialogue-text {
  color: white;
  font-family: 'Source Code Variable';

  &--body {
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 1px;
  }

  &--choice {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 1px;
  }

  &--subhead {
    display: block;
    font-size: 14px;
    font-weight: 800;
    line-height: 24px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  @include responsive(desktop) {
    &--body {
      font-size: 14px;
    }
    &--choice {
      font-size: 14px;
    line-height: 24px;
    }
    &--subhead {
      font-size: 16px;
    }
  }
}

.g-dialogue-choice {
  position: relative;
  margin-bottom: 10px;
  padding: 10px 15px;
  background-color: rgba(black, .5);
  border: 0;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(white, .0);

  &:before {
    content: "";
    position: absolute;
    left: 12px;
    top: 22px;
    height: 10px;
    width: 0%;
    background: rgba(white, .1);
    transition: .1s ease width;
  }

  &--selected {
    &:before { width: 75%; }
  }

  @include responsive(desktop) {
    margin-bottom: 20px;
    padding: 10px 20px;
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
