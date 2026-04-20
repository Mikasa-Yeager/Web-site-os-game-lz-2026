<script setup>
import { ru } from '../../content/ru'

defineProps({
  title: { type: String, required: true }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="overlay">
    <section class="game-window panel">
      <header class="game-window-header">
        <strong>{{ title }}</strong>
        <button type="button" class="secondary" @click="emit('close')">{{ ru.common.close }}</button>
      </header>
      <div class="game-window-content">
        <slot />
      </div>
    </section>
  </div>
</template>
