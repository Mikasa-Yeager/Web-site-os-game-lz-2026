<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import BootScreen from './components/BootScreen.vue'
import Desktop from './components/Desktop.vue'
import PasswordModal from './components/PasswordModal.vue'
import Notifications from './components/Notifications.vue'
import CluePanel from './components/CluePanel.vue'
import StoryDialogue from './components/StoryDialogue.vue'
import GuideCharacter from './components/GuideCharacter.vue'
import ConsoleApp from './components/ConsoleApp.vue'
import NotepadApp from './components/NotepadApp.vue'
import AchievementsApp from './components/AchievementsApp.vue'
import GameWindow from './components/games/GameWindow.vue'
import PlaceholderGame from './components/games/PlaceholderGame.vue'
import FinalGame from './components/games/FinalGame.vue'
import BookFillGame from './components/games/BookFillGame.vue'
import PuzzleGame from './components/games/PuzzleGame.vue'
import MemoryQuizGame from './components/games/MemoryQuizGame.vue'
import KeyGame from './components/games/KeyGame.vue'
import { initialFiles } from './composables/useFiles'
import gagasikImage from './assets/gagasik.png'
import backgroundMelody from './sounds/melody_background.mp3'
import guideMelody from './sounds/melody_guide_character.mp3'
import melody1 from './sounds/melody_1.mp3'
import melody2 from './sounds/melody_2.mp3'
import melody3 from './sounds/melody_3.mp3'
import melody4 from './sounds/melody_4.mp3'
import finalVideo from './assets/final_video.mp4'
import { ru } from './content/ru'

const files = ref(initialFiles)
const showBoot = ref(true)
const showPasswordModal = ref(false)
const secretUnlocked = ref(false)
const activeGame = ref(null)
const notifications = ref(null)
const collectedClues = ref([])
const totalClues = 4
const correctPassword = 'тслпнс'
const showClueModal = ref(false)
const showStoryDialogue = ref(false)
const dialogueStep = ref(0)
const baseDialogueLines = ru.story.defaultLines
const dialogueLines = ref([...baseDialogueLines])
let dialogueCompleteCallback = null
const isFinalTransition = ref(false)
const showFinalVideo = ref(false)
const achievements = ref({
  a1: false,
  a2: false,
  a3: false,
  a4: false
})
const bgAudio = new Audio(backgroundMelody)
bgAudio.loop = true
bgAudio.volume = 0.25
const guideAudio = new Audio(guideMelody)
guideAudio.loop = true
guideAudio.volume = 0.22
const gameAudioMap = {
  book: new Audio(melody1),
  memory: new Audio(melody2),
  puzzle: new Audio(melody3),
  key: new Audio(melody4)
}
Object.values(gameAudioMap).forEach((audio) => {
  audio.loop = true
  audio.volume = 0.18
})

const gameComponents = {
  placeholder: PlaceholderGame,
  memory: MemoryQuizGame,
  key: KeyGame,
  final: FinalGame,
  book: BookFillGame,
  puzzle: PuzzleGame
}

const hintCodeMap = {
  gaga11: { gameId: 'game-1', text: ru.hintCodes.gaga11 },
  mamasito228: { gameId: 'game-2', text: ru.hintCodes.mamasito228 },
  pakhesu8: { gameId: 'game-3', text: ru.hintCodes.pakhesu8 },
  gaygasik: { gameId: 'game-key', text: ru.hintCodes.gaygasik }
}

const activeGameComponent = computed(() => {
  if (!activeGame.value) {
    return null
  }
  return gameComponents[activeGame.value.game] ?? PlaceholderGame
})

const activeWindows = computed(() => {
  if (!activeGame.value) {
    return []
  }

  return [
    {
      id: activeGame.value.id,
      title: activeGame.value.title,
      isActive: true
    }
  ]
})

function notify(message, type = 'info') {
  notifications.value?.push(message, type)
}

function onBootComplete() {
  showBoot.value = false
  startStoryDialogue()
  notify(ru.app.loaded)
}

function handleFileClick(file) {
  if (file.type === 'protected') {
    showPasswordModal.value = true
    return
  }

  if (file.type === 'text') {
    startStoryDialogue()
    return
  }

  if (file.type === 'game' || file.type === 'tool') {
    if (file.game === 'final') {
      startFinalSequence()
      return
    }
    activeGame.value = file
    return
  }
}

function focusWindow() {
  // Left intentionally simple: current implementation has one active window at a time.
}

function startStoryDialogue(customLines = null, onComplete = null) {
  dialogueLines.value = customLines ?? [...baseDialogueLines]
  dialogueStep.value = 0
  showStoryDialogue.value = true
  dialogueCompleteCallback = onComplete
  switchToGuideMusic()
}

function nextStoryLine() {
  if (dialogueStep.value < dialogueLines.value.length - 1) {
    dialogueStep.value += 1
    return
  }
  showStoryDialogue.value = false
  if (dialogueCompleteCallback) {
    const callback = dialogueCompleteCallback
    dialogueCompleteCallback = null
    callback()
  }
  startBackgroundMusic()
}

function startBackgroundMusic() {
  stopAllMusic()
  bgAudio.play().catch(() => {})
}

function switchToGuideMusic() {
  stopAllMusic()
  guideAudio.play().catch(() => {})
}

function switchToGameMusic(gameKey) {
  const targetAudio = gameAudioMap[gameKey]
  if (!targetAudio) {
    startBackgroundMusic()
    return
  }
  stopAllMusic()
  targetAudio.play().catch(() => {})
}

function stopAllMusic() {
  const allTracks = [bgAudio, guideAudio, ...Object.values(gameAudioMap)]
  allTracks.forEach((audio) => {
    audio.pause()
    audio.currentTime = 0
  })
}

function openClues() {
  showClueModal.value = true
}

function closeClues() {
  showClueModal.value = false
}

function onPasswordSuccess() {
  showPasswordModal.value = false
  secretUnlocked.value = true
  files.value = files.value.map((file) =>
    file.id === 'final'
      ? {
          ...file,
          visible: true
        }
      : file
  )
  addClue('password', ru.app.passwordClue)
  notify(ru.app.secretOpened, 'success')
}

function onPasswordError() {
  notify(ru.app.wrongPassword, 'error')
}

function closePasswordModal() {
  showPasswordModal.value = false
}

function closeGame() {
  activeGame.value = null
}

function addClue(id, text) {
  if (collectedClues.value.some((clue) => clue.id === id)) {
    return
  }
  collectedClues.value.push({ id, text })
}

function handleGameComplete(payload) {
  if (!activeGame.value) {
    return
  }

  if (payload?.clue) {
    addClue(activeGame.value.id, payload.clue)
    notify(ru.app.clueAdded, 'success')
  }

  if (payload?.final) {
    notify(ru.app.finalComplete, 'success')
  }

  closeGame()
}

function showRecoveredFiles() {
  files.value = files.value.map((file) =>
    file.id === 'secret'
      ? {
          ...file,
          visible: true
        }
      : file
  )
  notify(ru.app.hiddenFileRecovered, 'success')
}

function onConsoleHintRevealed(payload) {
  addClue(`console-${payload.code}`, payload.text)
  notify(ru.app.hintAdded, 'success')
}

function unlockAchievement(key, message) {
  if (achievements.value[key]) {
    return
  }
  achievements.value[key] = true
  notify(message, 'success')
}

function onAchievementCommand() {
  unlockAchievement('a2', `${ru.app.achievementLines.a2} ${ru.app.achievementUnlocked}`)
}

function onHiddenGagasikClick() {
  unlockAchievement('a3', `${ru.app.achievementLines.a3} ${ru.app.achievementUnlocked}`)
}

function startFinalSequence() {
  if (isFinalTransition.value || showFinalVideo.value) {
    return
  }
  isFinalTransition.value = true
  fadeOutAllMusic(1800)
  setTimeout(() => {
    showFinalVideo.value = true
  }, 1800)
}

function fadeOutAllMusic(durationMs) {
  const tracks = [bgAudio, guideAudio, ...Object.values(gameAudioMap)]
  const stepMs = 120
  const steps = Math.max(1, Math.floor(durationMs / stepMs))
  const originalVolumes = tracks.map((audio) => audio.volume)

  let tick = 0
  const timer = setInterval(() => {
    tick += 1
    const factor = Math.max(0, 1 - tick / steps)
    tracks.forEach((audio, index) => {
      audio.volume = originalVolumes[index] * factor
    })

    if (tick >= steps) {
      clearInterval(timer)
      stopAllMusic()
      tracks.forEach((audio, index) => {
        audio.volume = originalVolumes[index]
      })
    }
  }, stepMs)
}

function onFinalVideoEnded() {
  showFinalVideo.value = false
  isFinalTransition.value = false
  unlockAchievement('a1', `${ru.app.achievementLines.a1} ${ru.app.achievementUnlocked}`)
  files.value = files.value.map((file) =>
    file.id === 'achievements'
      ? {
          ...file,
          visible: true
        }
      : file
  )
  startStoryDialogue([ru.story.finalLine], () => {
    startBackgroundMusic()
  })
}

watch(
  () => activeGame.value?.game,
  (currentGame) => {
    if (!currentGame) {
      if (!showStoryDialogue.value) {
        startBackgroundMusic()
      }
      return
    }
    switchToGameMusic(currentGame)
  }
)

watch(showStoryDialogue, (isOpen) => {
  if (isOpen) {
    switchToGuideMusic()
    return
  }
  if (!activeGame.value) {
    startBackgroundMusic()
  }
})

setTimeout(() => {
  unlockAchievement('a4', `${ru.app.achievementLines.a4} ${ru.app.achievementUnlocked}`)
}, 15 * 60 * 1000)

onUnmounted(() => {
  stopAllMusic()
})
</script>

<template>
  <div class="app-root">
    <div class="bg-grid"></div>
    <div class="scanlines"></div>

    <BootScreen v-if="showBoot" @complete="onBootComplete" />
    <Desktop
      v-else
      :files="files"
      :secret-unlocked="secretUnlocked"
      :collected-clues="collectedClues"
      :total-clues="totalClues"
      :active-windows="activeWindows"
      @file-click="handleFileClick"
      @focus-window="focusWindow"
    />

    <StoryDialogue
      v-if="showStoryDialogue"
      :line="dialogueLines[dialogueStep]"
      :is-last="dialogueStep === dialogueLines.length - 1"
      :character-src="gagasikImage"
      @next="nextStoryLine"
    />

    <PasswordModal
      v-if="showPasswordModal"
      :correct-password="correctPassword"
      @success="onPasswordSuccess"
      @error="onPasswordError"
      @close="closePasswordModal"
    />

    <GameWindow v-if="activeGame" :title="activeGame.title" @close="closeGame">
      <template v-if="activeGame.id === 'console'">
        <ConsoleApp
          :completed-game-ids="collectedClues.map((clue) => clue.id)"
          :clues="collectedClues"
          :hint-code-map="hintCodeMap"
          @recover-files="showRecoveredFiles"
          @hint-revealed="onConsoleHintRevealed"
          @achievement-command="onAchievementCommand"
        />
      </template>
      <template v-else-if="activeGame.id === 'notepad'">
        <NotepadApp />
      </template>
      <template v-else-if="activeGame.id === 'achievements'">
        <AchievementsApp :achievements="achievements" />
      </template>
      <component
        v-else
        :is="activeGameComponent"
        @complete="handleGameComplete"
        @close="closeGame"
      />
    </GameWindow>

    <div v-if="isFinalTransition" class="final-fade"></div>
    <div v-if="showFinalVideo" class="final-video-overlay">
      <video class="final-video" :src="finalVideo" autoplay controls @ended="onFinalVideoEnded" />
    </div>

    <GuideCharacter
      v-if="!showBoot && !showStoryDialogue"
      :character-src="gagasikImage"
      @open-clues="openClues"
    />
    <button

      class="hidden-gagasik"
      type="button"
      title="?"
      @click="onHiddenGagasikClick"
    >
      <img src="../src/assets/gagasik.png" width="18px" height="18px" style="margin: -10px;"/>
    </button>
    <CluePanel :clues="collectedClues" :visible="showClueModal" @close="closeClues" />
    <Notifications ref="notifications" />
  </div>
</template>
