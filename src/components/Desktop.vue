<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ru } from '../content/ru'

const props = defineProps({
  files: { type: Array, required: true },
  secretUnlocked: { type: Boolean, default: false },
  collectedClues: { type: Array, required: true },
  totalClues: { type: Number, required: true },
  activeWindows: { type: Array, default: () => [] }
})

const emit = defineEmits(['file-click', 'focus-window'])
const currentTime = ref('')

const iconEmoji = {
  txt: '📄',
  game: '🎮',
  lock: '🔐',
  final: '💾',
  books: '📚',
}

const statusText = computed(() =>
  props.secretUnlocked ? ru.desktop.statusUnlocked : ru.desktop.statusLimited
)
const statusClass = computed(() => (props.secretUnlocked ? 'status-unlocked' : 'status-locked'))
const visibleFiles = computed(() => props.files.filter((file) => file.visible !== false))

function isLocked(file) {
  return file.lockedUntilSecret && !props.secretUnlocked
}

function updateClock() {
  currentTime.value = new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

let intervalId
onMounted(() => {
  updateClock()
  intervalId = setInterval(updateClock, 1000)
})
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <main class="os-container">
    <div class="top-bar">
      <div class="system-info">
        <span>OS: <strong>Open_GAGAS_OS v1.0</strong></span>
        <span>{{ ru.desktop.userLabel }}: <strong>{{ ru.desktop.guest }}</strong></span>
        <span>{{ ru.desktop.statusLabel }}: <strong :class="statusClass">{{ statusText }}</strong></span>
      </div>
      <div class="clock">{{ currentTime }}</div>
    </div>

    <section class="desktop">
      <button
        v-for="file in visibleFiles"
        :key="file.id"
        class="file-item"
        type="button"
        :class="{ secret: file.type === 'protected', locked: isLocked(file) }"
        @click="emit('file-click', file)"
      >
        <div class="file-icon">
          <img v-if="file.iconSrc" :src="file.iconSrc" :alt="file.name" />
          <span v-else>{{ iconEmoji[file.icon] ?? '🗂️' }}</span>
        </div>
        <div class="file-name">{{ file.name }}</div>
      </button>
    </section>

    <div class="taskbar">
      <div class="taskbar-apps">
        <button
          v-for="app in activeWindows"
          :key="app.id"
          class="taskbar-item"
          type="button"
          :class="{ active: app.isActive }"
          @click="emit('focus-window', app.id)"
        >
          {{ app.title }}
        </button>
      </div>
      <div class="progress-indicator">
        {{ ru.desktop.progress }}: <span>{{ collectedClues.length }}/{{ totalClues }}</span>
      </div>
    </div>
  </main>
</template>
