<script setup>
import { ru } from '../content/ru'

defineProps({
  characterSrc: { type: String, required: true }
})

const emit = defineEmits(['open-clues'])
</script>

<template>
  <button class="guide-character" type="button" @click="emit('open-clues')">
    <img :src="characterSrc" :alt="ru.story.guideAlt" />
  </button>
</template>
