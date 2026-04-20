<script setup>
import { computed, ref } from 'vue'
import effectDone from '../../sounds/effect_done.wav'
import effectError from '../../sounds/effect_error.mp3'
import effectComplete from '../../sounds/effect_complete.wav'
import { ru } from '../../content/ru'

const emit = defineEmits(['complete', 'close'])

const questions = ru.memoryGame.questions

const step = ref(0)
const selected = ref('')
const errorText = ref('')
const doneAudio = new Audio(effectDone)
const errorAudio = new Audio(effectError)
const completeAudio = new Audio(effectComplete)

const currentQuestion = computed(() => questions[step.value])

function submit() {
  if (selected.value !== currentQuestion.value.answer) {
    errorText.value = ru.memoryGame.error
    errorAudio.currentTime = 0
    errorAudio.play().catch(() => {})
    return
  }

  errorText.value = ''
  selected.value = ''

  if (step.value < questions.length - 1) {
    doneAudio.currentTime = 0
    doneAudio.play().catch(() => {})
    step.value += 1
    return
  }

  completeAudio.currentTime = 0
  completeAudio.play().catch(() => {})
  emit('complete', {
    clue: ru.memoryGame.clue
  })
}
</script>

<template>
  <div class="memory-game">
    <div class="book-header">
      <h3>{{ ru.memoryGame.title }}</h3>
      <p>{{ ru.memoryGame.questionLabel }} {{ step + 1 }} / {{ questions.length }}</p>
    </div>

    <div class="book-page">
      <p class="book-text">{{ currentQuestion.question }}</p>
      <div class="memory-options">
        <label v-for="option in currentQuestion.options" :key="option" class="memory-option">
          <input v-model="selected" type="radio" :value="option" />
          <span>{{ option }}</span>
        </label>
      </div>
    </div>

    <p v-if="errorText" class="book-error">{{ errorText }}</p>

    <div class="actions">
      <button type="button" @click="submit">
        {{ step === questions.length - 1 ? ru.memoryGame.finish : ru.memoryGame.next }}
      </button>
      <button type="button" class="secondary" @click="emit('close')">{{ ru.common.exit }}</button>
    </div>
  </div>
</template>
