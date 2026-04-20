<script setup>
import { computed, ref } from 'vue'
import effectDone from '../../sounds/effect_done.wav'
import effectError from '../../sounds/effect_error.mp3'
import effectComplete from '../../sounds/effect_complete.wav'
import { ru } from '../../content/ru'

const emit = defineEmits(['complete', 'close'])

const rounds = ru.keyGame.steps

const step = ref(0)
const selected = ref('')
const errorText = ref('')
const doneAudio = new Audio(effectDone)
const errorAudio = new Audio(effectError)
const completeAudio = new Audio(effectComplete)

const currentRound = computed(() => rounds[step.value])

function submit() {
  if (selected.value !== currentRound.value.answer) {
    errorText.value = ru.keyGame.error
    errorAudio.currentTime = 0
    errorAudio.play().catch(() => {})
    return
  }

  errorText.value = ''
  selected.value = ''

  if (step.value < rounds.length - 1) {
    doneAudio.currentTime = 0
    doneAudio.play().catch(() => {})
    step.value += 1
    return
  }

  completeAudio.currentTime = 0
  completeAudio.play().catch(() => {})
  emit('complete', {
    clue: ru.keyGame.clue
  })
}
</script>

<template>
  <div class="memory-game">
    <div class="book-header">
      <h3>{{ ru.keyGame.title }}</h3>
      <p>{{ currentRound.title }} / {{ rounds.length }}</p>
    </div>

    <div class="book-page">
      <p class="book-text">{{ currentRound.prompt }}</p>
      <div class="memory-options">
        <label v-for="option in currentRound.options" :key="option" class="memory-option">
          <input v-model="selected" type="radio" :value="option" />
          <span>{{ option }}</span>
        </label>
      </div>
    </div>

    <p v-if="errorText" class="book-error">{{ errorText }}</p>

    <div class="actions">
      <button type="button" @click="submit">
        {{ step === rounds.length - 1 ? ru.keyGame.finish : ru.keyGame.next }}
      </button>
      <button type="button" class="secondary" @click="emit('close')">{{ ru.common.exit }}</button>
    </div>
  </div>
</template>
