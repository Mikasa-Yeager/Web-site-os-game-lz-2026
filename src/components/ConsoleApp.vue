<script setup>
import { ref } from 'vue'
import { ru } from '../content/ru'

const props = defineProps({
  completedGameIds: { type: Array, default: () => [] },
  clues: { type: Array, default: () => [] },
  hintCodeMap: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['recover-files', 'hint-revealed', 'achievement-command'])

const input = ref('')
const lines = ref([
  ru.console.header,
  ru.console.welcome
])

function print(text) {
  lines.value.push(text)
}

function format(template, payload = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => payload[key] ?? '')
}

function handleGetHint(argument) {
  if (!argument) {
    print(ru.console.usage)
    return
  }

  const code = argument.trim().toLowerCase()
  const hintConfig = props.hintCodeMap[code]
  if (!hintConfig) {
    print(format(ru.console.unknownCipher, { code }))
    return
  }

  if (!props.completedGameIds.includes(hintConfig.gameId)) {
    print(ru.console.blockedHint)
    return
  }

  const exists = props.clues.some((item) => item.id === `console-${code}`)
  if (!exists) {
    emit('hint-revealed', {
      code,
      text: hintConfig.text
    })
  }

  if (exists) {
    print(format(ru.console.hintExists, { code, text: hintConfig.text }))
    return
  }

  print(format(ru.console.hintShown, { code, text: hintConfig.text }))
}

function runCommand() {
  const command = input.value.trim()
  if (!command) {
    return
  }

  print(`> ${command}`)
  const [name, argument] = command.split(/\s+/, 2)

  if (name === 'getinfo') {
    print(ru.console.commands)
    print(format(ru.console.ciphers, { codes: Object.keys(props.hintCodeMap).join(', ') }))
  } else if (name === 'gethint') {
    handleGetHint(argument ?? '')
  } else if (name === 'res') {
    emit('recover-files')
    print(ru.console.recovered)
  } else if (name === 'aerorise') {
    emit('achievement-command')
    print(ru.console.secretCommandAccepted)
  } else {
    print(ru.console.unknownCommand)
  }

  input.value = ''
}
</script>

<template>
  <div class="console-app">
    <div class="console-screen panel">
      <p v-for="(line, index) in lines" :key="`${line}-${index}`">{{ line }}</p>
    </div>
    <div class="console-input-row">
      <span>&gt;</span>
      <input v-model="input" type="text" :placeholder="ru.console.inputPlaceholder" @keyup.enter="runCommand" />
      <button type="button" @click="runCommand">{{ ru.console.enter }}</button>
    </div>
  </div>
</template>
