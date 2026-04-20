<script setup>
import { ref } from 'vue'

const items = ref([])

function push(message, type = 'info') {
  const id = crypto.randomUUID()
  items.value.push({ id, message, type })
  setTimeout(() => {
    items.value = items.value.filter((item) => item.id !== id)
  }, 2400)
}

defineExpose({ push })
</script>

<template>
  <aside class="notifications">
    <div v-for="item in items" :key="item.id" class="notification panel" :class="item.type">
      {{ item.message }}
    </div>
  </aside>
</template>
