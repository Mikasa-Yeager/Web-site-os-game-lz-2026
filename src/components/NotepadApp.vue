<script setup>
import { ref, watch } from 'vue'
import { ru } from '../content/ru'

const STORAGE_KEY = 'rose_os_notepad_text'
const text = ref(localStorage.getItem(STORAGE_KEY) ?? '')

watch(text, (value) => {
  localStorage.setItem(STORAGE_KEY, value)
})
</script>

<template>
  <div class="notepad-app">
    <p>{{ ru.notepad.title }}</p>
    <textarea v-model="text" :placeholder="ru.notepad.placeholder"></textarea>
  </div>
</template>
