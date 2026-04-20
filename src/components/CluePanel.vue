<script setup>
import { ru } from '../content/ru'

defineProps({
  clues: { type: Array, required: true },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="visible" class="overlay">
    <section class="clue-modal panel">
      <div class="clue-modal-head">
        <h3>{{ ru.clues.title }}</h3>
        <button class="clue-close" type="button" @click="emit('close')">✕</button>
      </div>
      <ul v-if="clues.length > 0">
        <li v-for="clue in clues" :key="clue.id">{{ clue.text }}</li>
      </ul>
      <p v-else>{{ ru.clues.empty }}</p>
    </section>
  </div>
</template>
