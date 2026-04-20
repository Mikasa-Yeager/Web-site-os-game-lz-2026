<script setup>
import { ru } from '../content/ru'

defineProps({
  line: { type: String, required: true },
  isLast: { type: Boolean, default: false },
  characterSrc: { type: String, required: true }
})

const emit = defineEmits(['next'])
</script>

<template>
  <div class="story-overlay">
    <div class="story-layout">
      <img class="story-character" :src="characterSrc" :alt="ru.story.guideAlt" />
      <section class="story-dialog panel">
        <p class="story-text">{{ line }}</p>
        <div class="actions">
          <button type="button" @click="emit('next')">
            {{ isLast ? ru.story.finishButton : ru.story.nextButton }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
