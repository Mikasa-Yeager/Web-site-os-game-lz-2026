<script setup>
import { ref } from 'vue'
import { ru } from '../../content/ru'

const emit = defineEmits(['complete', 'close'])
const finished = ref(false)
const failedToLoad = ref(false)
const videoPath = '/final.mp4'

function onVideoEnded() {
  finished.value = true
  emit('complete', {
    final: true
  })
}

function onVideoError() {
  failedToLoad.value = true
}
</script>

<template>
  <div class="game-body">
    <p>{{ ru.final.intro }}</p>
    <video
      v-if="!failedToLoad"
      class="final-video"
      controls
      preload="metadata"
      @ended="onVideoEnded"
      @error="onVideoError"
    >
      <source :src="videoPath" type="video/mp4" />
    </video>
    <p v-else class="book-error">
      {{ ru.final.missingVideo }}
    </p>
    <p v-if="finished" class="final-message">
      {{ ru.final.doneText }}
    </p>
  </div>
</template>
