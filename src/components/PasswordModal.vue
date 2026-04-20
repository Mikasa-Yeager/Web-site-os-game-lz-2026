<script setup>
import { ref } from 'vue'
import { ru } from '../content/ru'

const props = defineProps({
  correctPassword: { type: String, required: true }
})

const emit = defineEmits(['success', 'error', 'close'])
const input = ref('')

function submit() {
  if (input.value.trim().toLowerCase() === props.correctPassword.toLowerCase()) {
    emit('success')
    input.value = ''
    return
  }
  emit('error')
}
</script>

<template>
  <div class="overlay">
    <section class="modal panel">
      <h2>{{ ru.password.title }}</h2>
      <input v-model="input" type="text" :placeholder="ru.password.placeholder" @keyup.enter="submit" />
      <div class="actions">
        <button type="button" @click="submit">{{ ru.common.confirm }}</button>
        <button type="button" class="secondary" @click="emit('close')">{{ ru.common.cancel }}</button>
      </div>
    </section>
  </div>
</template>
