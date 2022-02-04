<template>
  <div class="dialogue" v-if="showDialogue" :class="classes">
    <div class="dialogue__container">
      <transition name="choices" mode="out-in">
        <div class="dialogue__choices" v-if="showChoices">
          <span ref="cursor" class="dialogue-cursor" />

          <button 
            :ref="el => { if (el) choicesEl[index] = el }"
            v-for="(choice, index) in choices"
            class="dialogue-choice"
            :class="{ 'dialogue-choice--selected': index === activeChoice }"
            :key="index"
            @click="onOptionClick(index)"
            @mouseenter="onOptionSelect(index)"
            @focus="onOptionSelect(index)"
          >
            <span class="dialogue-text dialogue-text--choice">
              {{ choice }}
            </span>
          </button>
        </div>
      </transition>

      <transition name="prompt" @enter="onPromptOpen">
        <form class="dialogue-prompt" v-if="showPrompt" @submit.prevent="onPromptSubmit">
          <input
            type="text"
            class="dialogue-prompt__input dialogue-prompt__input--text"
            placeholder="Type here"
            v-model="promptText"
          />

          <button class="dialogue-prompt__confirm">
            OK
          </button>
        </form>
      </transition>

      <div class="dialogue__message" @click="onMessageClick">
        <span class="dialogue-text dialogue-text--subhead">
          {{ message.speaker }}:
        </span>

        <span v-typewrite="{ text: message.text, skip, complete: onTypewriteEnd }"
          class="dialogue-text dialogue-text--body"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { typewrite } from '@/directives/typewrite'
import { useWindow, useDialogue, useInput, useAuth } from '@/store'
import socket from '@/socket'
import anime from 'animejs'

export default defineComponent({
  directives: { typewrite },

  setup (props) {
    const { isMobile } = useWindow()
    const { message, choices, showDialogue, continueDialogue } = useDialogue()
    const { axis, buttonDown } = useInput()
    const { login } = useAuth()

    const cursor = ref(null)
    const choicesEl = reactive([])
    const isTyping = ref(false)
    const skip = ref(false)
    const showChoices = ref(false)
    const showPrompt = ref(false)
    const promptType = ref(null)
    const promptText = ref('')
    const activeChoice = ref(0)
    const questionIdentifier = ref(null)

    const showUnderscore = computed(() => !showChoices.value && !showPrompt.value)
    const classes = computed(() => ({
      'dialogue--show-underscore': showUnderscore.value,
      'dialogue--show-choices': showChoices.value,
      'dialogue--perspective': props.perspective,
    }))

    onMounted(() =>
      socket.on('dialogue:prompt', onDialoguePrompt)
    )

    onBeforeUnmount(() =>
      socket.off('dialogue:prompt', onDialoguePrompt)
    )

    buttonDown(({ button }) => {
      if (button === 'confirm') confirm()
    })

    watch(message, () => {
      skip.value = false
      isTyping.value = true
    })

    watch(activeChoice, (index) => {
      if (!showChoices.value) return

      const choice = choicesEl[index]

      if (!choice) return

      const height = isMobile.value ? 38 : 44
      const rectA = choice.getBoundingClientRect()
      const rectB = choice.parentNode.getBoundingClientRect()
      const offset = (rectA.top - rectB.top) + (height / 2)
      const selectedClass = 'dialogue-choice--selected'

      choicesEl.forEach(choice => choice.classList.remove(selectedClass))
      choice.classList.add(selectedClass)

      anime({
        targets: cursor.value,
        top: `${offset}px`,
        duration: 150,
        easing: 'easeOutQuad'
      })
    })

    watch(axis.value, (value) => {
      const { y } = value

      if (y > 0) selectPrevious()
      if (y < 0) selectNext()
    })

    const select = (index) => {
      if (index < 0) return
      if (index > choices.value.length - 1) return

      activeChoice.value = index
    }

    const selectPrevious = () => {
      select(activeChoice.value - 1)
    }

    const selectNext = () => {
      select(activeChoice.value + 1)
    }

    const onDialogueContinue = continueDialogue

    const onDialoguePrompt = (identifier, type) => {
      prompt(type)

      questionIdentifier.value = identifier
    }

    const onDialogueReply = async (value) => {
      const identifier = questionIdentifier.value

      if (identifier === 'request-access-code')
        await login(value)

      confirm()
    }

    const onOptionClick = (index) => {
      if (isTyping.value) return

      choose(index)
    }

    const onOptionSelect = (index) => {
      select(index)
    }

    const onMessageClick = () => {
      if (showChoices.value) return
      if (showPrompt.value) return

      activeChoice.value = 0
      confirm()
    }

    const onTypewriteEnd = () => {
      isTyping.value = false
      skip.value = false
    }

    const onPromptOpen = (el, done) => {
      const input = el.querySelector('input')

      setTimeout(() => {
        input.focus()
        done()
      }, 400)
    }

    const onPromptSubmit = () => {
      onDialogueReply()

      promptText.value = ''
      promptType.value = null
      showPrompt.value = false
    }

    const confirm = () => {
      if (isTyping.value)
        return skip.value = true

      if (!showChoices.value && choices.value.length > 1)
        return showChoices.value = true
      
      if (!showPrompt.value && promptType.value)
        return showPrompt.value = true

      choose()
    }

    const prompt = (type) => {
      promptType.value = type
    }

    const choose = (index) => {
      if (showPrompt.value) return

      setTimeout(() => activeChoice.value = 0, 400)

      showChoices.value = false
      continueDialogue(index ?? activeChoice.value)
    }

    return {
      isMobile,
      choices,
      skip,
      cursor,
      classes,
      showUnderscore,
      choicesEl,
      activeChoice,
      showChoices,
      showDialogue,
      showPrompt,
      promptText,
      message,
      onDialogueContinue,
      onOptionSelect,
      onOptionClick,
      onPromptOpen,
      onPromptSubmit,
      onTypewriteEnd,
      onMessageClick
    }
  },

  props: {
    speed: {
      type: Number,
      default: 50
    },

    perspective: {
      type: Boolean,
      default: false
    },
  },
})
</script>

<style lang="scss">
.dialogue {
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

    .dialogue-cursor {
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
    .dialogue {
      &__arrow { display: none; }
    }
  }

  &--show-underscore {
    .dialogue {
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

    .dialogue-choice {
      transition: opacity .2s;

      &--selected { transition: opacity .2s .2s, transform .2s ease; }
    }

    .dialogue-cursor {
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
    .dialogue-choice {
      opacity: 0;

      &--selected { transform: scale(1.1); }
    }

    .dialogue-cursor {
      opacity: 0;
    }
  }

  .prompt-enter-active,
  .prompt-leave-active {
    transition: opacity .2s ease, transform .2s ease;
  }

  .prompt-enter-from,
  .prompt-leave-to {
    opacity: 0;
    transform: translateX(-20px)
  }
}

.dialogue-text {
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

.dialogue-choice {
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
    outline: 4px solid orange;

    // &:before { width: 75%; }
  }

  @include responsive(desktop) {
    margin-bottom: 20px;
    padding: 10px 20px;
  }
}

.dialogue-prompt {
  width: 100%;
  max-width: 420px;
  margin: auto 0 auto auto;
  display: flex;
  margin-bottom: 10px;

  &__input {
    flex: 1;
    height: 38px;
    padding: 0 15px;
    border: 0;
    font-family: 'Source Code Variable';
    font-weight: 600;
    font-size: 13px;
    margin-right: 10px;
    width: 100%;
    &:focus {
      outline: 4px solid orange;
    }
  }

  &__confirm {
    width: 80px;
    flex-shrink: 0;
    padding: 0;
    border: 0;
    text-transform: uppercase;
    font-family: 'Source Code Variable';
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 5px;
    text-indent: 5px;
    background: rgba(black, .5);
    color: white;
    &:focus {
      outline: 4px solid orange;
    }
  }

  @include responsive(desktop) {
    margin-bottom: 20px;

    &__input {
      font-size: 16px;
      padding: 0 20px;
      height: 44px;
    }
    &__confirm {
      width: 120px;
      letter-spacing: 10px;
      text-indent: 10px;
      font-size: 24px;
    }
  }
}

.dialogue-cursor {
  width: 8px;
  height: 8px;
  border-right: 4px solid orange;
  border-bottom: 4px solid orange;
  transform: rotateZ(-45deg);
  transform-origin: 0% 0%;

  /*
  &:before {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    top: 50%;
    left: 50%;
    background: orange;
    transform: translate(-5px, -5px);
  }
  */
}
</style>
