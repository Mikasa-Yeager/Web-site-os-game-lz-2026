<script setup>
import { onMounted, ref } from 'vue'
import { ru } from '../content/ru'

const emit = defineEmits(['complete'])
const lines = ref([])

const bootLines = ru.boot.lines

onMounted(() => {
  let index = 0
  const timer = setInterval(() => {
    if (index < bootLines.length) {
      lines.value.push(bootLines[index])
      index += 1
      return
    }
    clearInterval(timer)
    setTimeout(() => emit('complete'), 500)
  }, 450)
})
</script>

<template>
  <section class="boot-screen panel">
    <p v-for="line in lines" :key="line">{{ line }}</p>
  </section>
</template>
