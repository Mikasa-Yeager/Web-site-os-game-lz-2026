<script setup>
import { ref } from 'vue'
import { ru } from '../../content/ru'

const emit = defineEmits(['complete', 'close'])
const answer = ref('')

function submit() {
  if (answer.value.trim() === '42') {
    emit('complete', {
      clue: ru.placeholderGame.clue
    })
    return
  }
  answer.value = ''
}
</script>

<template>
  <div class="game-body">
    <p>{{ ru.placeholderGame.description }}</p>
    <input v-model="answer" type="text" :placeholder="ru.placeholderGame.answerPlaceholder" @keyup.enter="submit" />
    <div class="actions">
      <button type="button" @click="submit">{{ ru.placeholderGame.check }}</button>
      <button type="button" class="secondary" @click="emit('close')">{{ ru.common.exit }}</button>
    </div>
  </div>
</template>
