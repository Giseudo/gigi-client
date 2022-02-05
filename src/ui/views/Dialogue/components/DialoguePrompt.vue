<template>
  <transition name="prompt">
    <form v-if="showPrompt" class="dialogue-prompt" @submit.stop.prevent="onSubmit">
      <g-input ref="input"
        class="dialogue-prompt__input"
        placeholder="Type here"
        v-model="text"
      />

      <!--input ref="input"
        type="text"
        class="dialogue-prompt__input dialogue-prompt__input--text"
        placeholder="Type here"
        v-model="text"
      />
      -->

      <g-button class="dialogue-prompt__confirm">
        Ok
      </g-button>
    </form>
  </transition>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import socket from '@/socket'

export default defineComponent({
  name: 'DialoguePrompt',

  emits: [ 'start', 'confirm' ],

  setup (_, { emit }) {
    const text = ref('')
    const input = ref(null)
    const promptId = ref(null)
    const showPrompt = inject('dialogue/showPrompt')

    onMounted(() =>
      socket.on('dialogue:prompt', onStart)
    )

    onBeforeUnmount(() =>
      socket.off('dialogue:prompt', onStart)
    )

    const onStart = (identifier) => {
      promptId.value = identifier
      text.value = ''

      emit('start')
    }

    watch(showPrompt, (value) => {
      if (!value) return

      setTimeout(() => input.value.focus(), 200)
    })

    const onSubmit = () => {
      emit('confirm', {
        identifier: promptId.value,
        value: text.value
      })
    }

    return {
      text,
      input,
      onSubmit,
      showPrompt
    }
  }
})
</script>

<style lang="scss">
.dialogue-prompt {
  width: 100%;
  max-width: 420px;
  margin: auto 0 auto auto;
  display: flex;
  margin-bottom: 10px;

  &__input {
    flex: 1;
    margin-right: 10px;
  }

  &__confirm {
    width: 80px;
    flex-shrink: 0;
    padding: 0;
    border: 0;
    text-align: center;
    display: flex;

    .g-text {
      text-transform: uppercase;
      font-family: 'Source Code Variable';
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 5px;
      text-indent: 5px;
    }

    &:focus { outline: 4px solid orange; }
  }

  @include responsive(desktop) {
    margin-bottom: 20px;

    &__input {
      font-size: 16px;
      height: 44px;
    }
    &__confirm {
      width: 120px;

      .g-text {
        font-size: 24px;
        letter-spacing: 10px;
        text-indent: 10px;
      }
    }
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
</style>
