<script setup>
import { computed, ref } from 'vue'
import effectDone from '../../sounds/effect_done.wav'
import effectError from '../../sounds/effect_error.mp3'
import effectComplete from '../../sounds/effect_complete.wav'
import { ru } from '../../content/ru'

const emit = defineEmits(['complete', 'close'])

const puzzleImages = import.meta.glob('../../assets/puzzles/*.jpg', {
  eager: true,
  import: 'default'
})

const sortedImageEntries = Object.entries(puzzleImages).sort(([a], [b]) => a.localeCompare(b))
const gridSize = 6
const pieceCount = gridSize * gridSize

const initialPieces = sortedImageEntries.slice(0, pieceCount).map(([path, src], index) => ({
  id: index + 1,
  slotId: index + 1,
  src,
  path
}))

const slots = Array.from({ length: pieceCount }, (_, index) => ({
  id: index + 1
}))
const previewPieces = [...initialPieces].sort((a, b) => a.slotId - b.slotId)

const shuffledPieces = [...initialPieces].sort(() => Math.random() - 0.5)
const availablePieces = ref(shuffledPieces)
const placedBySlot = ref({})
const dragPieceId = ref(null)
const errorText = ref('')
const doneAudio = new Audio(effectDone)
const errorAudio = new Audio(effectError)
const completeAudio = new Audio(effectComplete)

const isComplete = computed(() => Object.keys(placedBySlot.value).length === slots.length)

function onDragStart(pieceId) {
  dragPieceId.value = pieceId
  errorText.value = ''
}

function allowDrop(event) {
  event.preventDefault()
}

function onDrop(slotId) {
  if (dragPieceId.value == null) {
    return
  }

  const piece = availablePieces.value.find((item) => item.id === dragPieceId.value)
  if (!piece) {
    return
  }

  if (piece.slotId !== slotId) {
    errorText.value = ru.puzzleGame.wrongSlot
    errorAudio.currentTime = 0
    errorAudio.play().catch(() => {})
    dragPieceId.value = null
    return
  }

  doneAudio.currentTime = 0
  doneAudio.play().catch(() => {})
  placedBySlot.value[slotId] = piece
  availablePieces.value = availablePieces.value.filter((item) => item.id !== piece.id)
  dragPieceId.value = null
}

function finishPuzzle() {
  if (!isComplete.value) {
    errorText.value = ru.puzzleGame.fillAll
    errorAudio.currentTime = 0
    errorAudio.play().catch(() => {})
    return
  }

  completeAudio.currentTime = 0
  completeAudio.play().catch(() => {})
  emit('complete', {
    clue: ru.puzzleGame.clue
  })
}
</script>

<template>
  <div class="puzzle-game">
    <div class="book-header">
      <h3>{{ ru.puzzleGame.title }}</h3>
      <p>{{ ru.puzzleGame.subtitle }} ({{ gridSize }}x{{ gridSize }})</p>
    </div>

    <section class="puzzle-layout">
      <aside class="puzzle-preview panel">
        <p>{{ ru.puzzleGame.preview }}</p>
        <div class="puzzle-preview-grid" :style="{ '--puzzle-grid-size': gridSize }">
          <img
            v-for="piece in previewPieces"
            :key="`preview-${piece.id}`"
            :src="piece.src"
            :alt="`preview-${piece.id}`"
            class="puzzle-preview-piece"
          />
        </div>
      </aside>

      <div class="puzzle-board panel" :style="{ '--puzzle-grid-size': gridSize }">
        <div
          v-for="slot in slots"
          :key="slot.id"
          class="puzzle-slot"
          @dragover="allowDrop"
          @drop="onDrop(slot.id)"
        >
          <img
            v-if="placedBySlot[slot.id]"
            :src="placedBySlot[slot.id].src"
            :alt="`piece-${placedBySlot[slot.id].id}`"
            class="puzzle-piece fixed"
          />
          <span v-else class="puzzle-slot-index">{{ slot.id }}</span>
        </div>
      </div>

      <div class="puzzle-pieces panel">
        <div
          v-for="piece in availablePieces"
          :key="piece.id"
          class="puzzle-piece-wrap"
          draggable="true"
          @dragstart="onDragStart(piece.id)"
        >
          <img :src="piece.src" :alt="`piece-${piece.id}`" class="puzzle-piece" />
        </div>
      </div>
    </section>

    <p v-if="errorText" class="book-error">{{ errorText }}</p>

    <div class="actions">
      <button type="button" :disabled="!isComplete" @click="finishPuzzle">{{ ru.puzzleGame.finish }}</button>
      <button type="button" class="secondary" @click="emit('close')">{{ ru.common.exit }}</button>
    </div>
  </div>
</template>
