<script setup>
import { computed, ref } from 'vue'
import effectDone from '../../sounds/effect_done.wav'
import effectError from '../../sounds/effect_error.mp3'
import effectComplete from '../../sounds/effect_complete.wav'
import { ru } from '../../content/ru'

const emit = defineEmits(['complete', 'close'])

const tasks = ru.bookGame.tasks

const step = ref(0)
const selected = ref({})
const errorText = ref('')
const doneAudio = new Audio(effectDone)
const errorAudio = new Audio(effectError)
const completeAudio = new Audio(effectComplete)

const currentTask = computed(() => tasks[step.value])
const currentBlankCount = computed(() => currentTask.value.answers.length)

function selectedValuesExcept(blankIndex) {
  return Object.entries(selected.value)
    .filter(([index]) => Number(index) !== blankIndex)
    .map(([, value]) => value)
}

function setWord(blankIndex, word) {
  selected.value[blankIndex] = word
  errorText.value = ''
}

function isOptionDisabled(option, blankIndex) {
  return selectedValuesExcept(blankIndex).includes(option)
}

function validateCurrentTask() {
  for (let i = 0; i < currentTask.value.answers.length; i += 1) {
    if ((selected.value[i] ?? '') !== currentTask.value.answers[i]) {
      return false
    }
  }
  return true
}

function clearSelection() {
  selected.value = {}
}

function goNext() {
  if (!validateCurrentTask()) {
    errorText.value = ru.bookGame.error
    errorAudio.currentTime = 0
    errorAudio.play().catch(() => {})
    return
  }

  if (step.value < tasks.length - 1) {
    doneAudio.currentTime = 0
    doneAudio.play().catch(() => {})
    step.value += 1
    clearSelection()
    return
  }

  completeAudio.currentTime = 0
  completeAudio.play().catch(() => {})
  emit('complete', {
    clue: ru.bookGame.clue
  })
}

</script>

<template>
  <div class="book-game">
    <div class="book-header">
      <h3>{{ ru.bookGame.title }}</h3>
      <p>{{ ru.bookGame.page }} {{ step + 1 }} / {{ tasks.length }}</p>
    </div>

    <div class="book-page">
      <p class="book-text">
        {{ currentTask.before }}
        <template v-for="blankIndex in currentBlankCount" :key="`blank-${blankIndex}`">
          <select
            class="book-select"
            :value="selected[blankIndex - 1] ?? ''"
            @change="setWord(blankIndex - 1, $event.target.value)"
          >
            <option value="">{{ ru.bookGame.pickWord }}</option>
            <option
              v-for="option in currentTask.options"
              :key="`${blankIndex}-${option}`"
              :value="option"
              :disabled="isOptionDisabled(option, blankIndex - 1)"
            >
              {{ option }}
            </option>
          </select>
          <span v-if="blankIndex === 1">{{ currentTask.after }}</span>
          <span v-else-if="blankIndex === 2">{{ currentTask.tail ?? '' }}</span>
        </template>
      </p>
    </div>

    <div class="book-options panel">
      <p>{{ ru.bookGame.wordsForPage }}</p>
      <div class="book-options-list">
        <span v-for="option in currentTask.options" :key="option" class="book-option-pill">{{ option }}</span>
      </div>
    </div>

    <p v-if="errorText" class="book-error">{{ errorText }}</p>

    <div class="actions">
      <button type="button" @click="goNext">
        {{ step === tasks.length - 1 ? ru.bookGame.finish : ru.bookGame.continue }}
      </button>
      <button type="button" class="secondary" @click="emit('close')">{{ ru.common.exit }}</button>
    </div>
  </div>
</template>
