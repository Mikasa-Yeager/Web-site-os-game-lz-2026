<script setup>
import { computed, ref } from 'vue'
import { ru } from '../content/ru'
import StoryDialogue from './StoryDialogue.vue'

const props = defineProps({
  achievements: { type: Object, required: true },
  characterSrc: { type: String, required: true }
})

const rewardLines = [
  ru.achievements.rewardLine1 ?? 'Ты писька! (если тут ничего нет, то так не должно быть)',
]

const emit = defineEmits(['claim-reward'])

function startRewardDialogue() {
  showDialogue.value = true
}

function closeRewardDialogue() {
  showDialogue.value = false
  downloadImage()
}

const allUnlocked = computed(() => Object.values(props.achievements).every(Boolean))
</script>

<template>
  <div class="achievements-app">
    <h3>{{ ru.achievements.title }}</h3>
    <ul>
      <li>{{ ru.achievements.item1 }}: {{ achievements.a1 ? ru.achievements.open : ru.achievements.closed }}</li>
      <li>{{ ru.achievements.item2 }}: {{ achievements.a2 ? ru.achievements.open : ru.achievements.closed }}</li>
      <li>{{ ru.achievements.item3 }}: {{ achievements.a3 ? ru.achievements.open : ru.achievements.closed }}</li>
      <li>{{ ru.achievements.item4 }}: {{ achievements.a4 ? ru.achievements.open : ru.achievements.closed }}</li>
    </ul>
    <button v-if="allUnlocked" type="button" @click="startRewardDialogue">{{ ru.achievements.claim }}</button>
    <StoryDialogue
      v-if="showDialogue"
      :line="rewardLines[0]"
      :is-last="true"
      :character-src="characterSrc"
      @next="closeRewardDialogue"
    />
  </div>
</template>
