import booksIcon from '../assets/books.png'
import puzzleIcon from '../assets/puzzle.png'
import memoryIcon from '../assets/memory.png'
import noteIcon from '../assets/note.png'
import keyIcon from '../assets/key.png'
import terminalIcon from '../assets/terminal.png'
import { ru } from '../content/ru'

export const initialFiles = [
  {
    id: 'readme',
    name: ru.files.readmeName,
    type: 'text',
    icon: 'txt',
    title: ru.files.readmeTitle,
    content: ru.files.readmeContent
  },
  {
    id: 'game-1',
    name: 'memory-game.exe',
    type: 'game',
    icon: 'memory',
    iconSrc: memoryIcon,
    game: 'memory',
    title: ru.files.memoryTitle
  },
  {
    id: 'game-2',
    name: 'books-game.exe',
    type: 'game',
    icon: 'books',
    iconSrc: booksIcon,
    game: 'book',
    title: ru.files.booksTitle
  },
  {
    id: 'secret',
    name: 'secret.rose',
    type: 'protected',
    icon: 'lock',
    title: ru.files.secretTitle,
    visible: false
  },
  {
    id: 'console',
    name: 'console.sys',
    type: 'tool',
    icon: 'terminal',
    iconSrc: terminalIcon,
    title: ru.files.consoleTitle
  },
  {
    id: 'notepad',
    name: 'notepad.txt',
    type: 'tool',
    icon: 'note',
    iconSrc: noteIcon,
    title: ru.files.notepadTitle
  },
  {
    id: 'game-3',
    name: 'puzzle-game.exe',
    type: 'game',
    icon: 'puzzle',
    iconSrc: puzzleIcon,
    game: 'puzzle',
    title: ru.files.puzzleTitle
  },
  {
    id: 'game-key',
    name: 'key-game.exe',
    type: 'game',
    icon: 'key',
    iconSrc: keyIcon,
    game: 'key',
    title: ru.files.keyTitle,
    visible: true
  },
  {
    id: 'achievements',
    name: 'achievements.app',
    type: 'tool',
    icon: 'final',
    title: ru.files.achievementsTitle,
    visible: false
  },
  {
    id: 'final',
    name: 'final-game.exe',
    type: 'game',
    icon: 'final',
    game: 'final',
    title: ru.files.finalTitle,
    lockedUntilSecret: true,
    visible: false
  }
]
