<template>
  <div class="rich-text-editor">
    <!-- Toolbar -->
    <div class="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2">
      <div class="flex flex-wrap items-center gap-1">
        <!-- Text Formatting -->
        <div class="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            @click="toggleFormat('bold')"
            :class="['toolbar-btn', { 'active': isActive('bold') }]"
            title="Bold (Ctrl+B)"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h10a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
            </svg>
          </button>
          <button
            @click="toggleFormat('italic')"
            :class="['toolbar-btn', { 'active': isActive('italic') }]"
            title="Italic (Ctrl+I)"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4M14 4l-4 16m-2 0h4"></path>
            </svg>
          </button>
          <button
            @click="toggleFormat('underline')"
            :class="['toolbar-btn', { 'active': isActive('underline') }]"
            title="Underline (Ctrl+U)"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v8a5 5 0 0010 0V4M5 20h14"></path>
            </svg>
          </button>
          <button
            @click="toggleFormat('strike')"
            :class="['toolbar-btn', { 'active': isActive('strike') }]"
            title="Strikethrough"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14"></path>
            </svg>
          </button>
        </div>

        <!-- Headings -->
        <div class="flex items-center gap-1 px-2 border-r border-gray-300">
          <select
            @change="setHeading($event.target.value)"
            class="text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>
        </div>

        <!-- Lists -->
        <div class="flex items-center gap-1 px-2 border-r border-gray-300">
          <button
            @click="toggleFormat('bulletList')"
            :class="['toolbar-btn', { 'active': isActive('bulletList') }]"
            title="Bullet List"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
            </svg>
          </button>
          <button
            @click="toggleFormat('orderedList')"
            :class="['toolbar-btn', { 'active': isActive('orderedList') }]"
            title="Numbered List"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
            </svg>
          </button>
        </div>

        <!-- Alignment -->
        <div class="flex items-center gap-1 px-2 border-r border-gray-300">
          <button
            @click="setAlignment('left')"
            :class="['toolbar-btn', { 'active': alignment === 'left' }]"
            title="Align Left"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14"></path>
            </svg>
          </button>
          <button
            @click="setAlignment('center')"
            :class="['toolbar-btn', { 'active': alignment === 'center' }]"
            title="Align Center"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M6 18h12"></path>
            </svg>
          </button>
          <button
            @click="setAlignment('right')"
            :class="['toolbar-btn', { 'active': alignment === 'right' }]"
            title="Align Right"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14"></path>
            </svg>
          </button>
        </div>

        <!-- Insert -->
        <div class="flex items-center gap-1 px-2 border-r border-gray-300">
          <button
            @click="insertLink"
            class="toolbar-btn"
            title="Insert Link"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </button>
          <button
            @click="$emit('insert-image')"
            class="toolbar-btn"
            title="Insert Image"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </button>
          <button
            @click="toggleFormat('blockquote')"
            :class="['toolbar-btn', { 'active': isActive('blockquote') }]"
            title="Quote"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </button>
          <button
            @click="toggleFormat('code')"
            :class="['toolbar-btn', { 'active': isActive('code') }]"
            title="Code"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </button>
        </div>

        <!-- Undo/Redo -->
        <div class="flex items-center gap-1 px-2">
          <button
            @click="undo"
            class="toolbar-btn"
            title="Undo (Ctrl+Z)"
            :disabled="!canUndo"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
            </svg>
          </button>
          <button
            @click="redo"
            class="toolbar-btn"
            title="Redo (Ctrl+Y)"
            :disabled="!canRedo"
            type="button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div
      ref="editor"
      contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      @paste="handlePaste"
      class="min-h-[400px] max-h-[600px] overflow-y-auto p-4 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 prose prose-sm max-w-none"
      :innerHTML="modelValue"
    ></div>

    <!-- Footer -->
    <div class="mt-2 flex justify-between items-center text-sm text-gray-500">
      <div class="flex items-center gap-4">
        <span>{{ wordCount }} words</span>
        <span>{{ characterCount }} characters</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="togglePreview"
          type="button"
          class="text-purple-600 hover:text-purple-700"
        >
          {{ showPreview ? 'Hide' : 'Show' }} Preview
        </button>
        <button
          @click="toggleHTML"
          type="button"
          class="text-purple-600 hover:text-purple-700"
        >
          {{ showHTML ? 'Hide' : 'View' }} HTML
        </button>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
      <div class="prose prose-sm max-w-none" v-html="modelValue"></div>
    </div>

    <!-- HTML View Modal -->
    <div v-if="showHTML" class="mt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">HTML Source</h3>
      <textarea
        :value="modelValue"
        @input="updateHTML($event.target.value)"
        class="w-full h-48 p-3 font-mono text-sm border border-gray-300 rounded-lg"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Start writing...'
  }
})

const emit = defineEmits(['update:modelValue', 'insert-image'])

const editor = ref(null)
const showPreview = ref(false)
const showHTML = ref(false)
const alignment = ref('left')
const history = ref([])
const historyIndex = ref(-1)
const maxHistorySize = 50

const wordCount = computed(() => {
  const text = editor.value?.innerText || ''
  return text.trim() ? text.trim().split(/\s+/).length : 0
})

const characterCount = computed(() => {
  return editor.value?.innerText?.length || 0
})

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

const execCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  editor.value.focus()
  saveHistory()
}

const toggleFormat = (format) => {
  const commands = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strike: 'strikethrough',
    bulletList: 'insertUnorderedList',
    orderedList: 'insertOrderedList',
    blockquote: 'formatBlock',
    code: 'formatBlock'
  }
  
  if (format === 'blockquote') {
    execCommand(commands[format], '<blockquote>')
  } else if (format === 'code') {
    execCommand(commands[format], '<pre>')
  } else {
    execCommand(commands[format])
  }
}

const setHeading = (level) => {
  if (level) {
    execCommand('formatBlock', `<h${level}>`)
  } else {
    execCommand('formatBlock', '<p>')
  }
}

const setAlignment = (align) => {
  alignment.value = align
  const alignCommands = {
    left: 'justifyLeft',
    center: 'justifyCenter',
    right: 'justifyRight'
  }
  execCommand(alignCommands[align])
}

const insertLink = () => {
  const url = prompt('Enter URL:')
  if (url) {
    execCommand('createLink', url)
  }
}

const isActive = (format) => {
  const commands = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strike: 'strikethrough',
    bulletList: 'insertUnorderedList',
    orderedList: 'insertOrderedList',
    blockquote: 'blockquote',
    code: 'pre'
  }
  
  if (format === 'blockquote' || format === 'code') {
    const block = document.queryCommandValue('formatBlock')
    return block.toLowerCase() === commands[format]
  }
  
  return document.queryCommandState(commands[format])
}

const handleInput = () => {
  emit('update:modelValue', editor.value.innerHTML)
  saveHistory()
}

const handleKeydown = (e) => {
  // Keyboard shortcuts
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'b':
        e.preventDefault()
        toggleFormat('bold')
        break
      case 'i':
        e.preventDefault()
        toggleFormat('italic')
        break
      case 'u':
        e.preventDefault()
        toggleFormat('underline')
        break
      case 'z':
        e.preventDefault()
        undo()
        break
      case 'y':
        e.preventDefault()
        redo()
        break
    }
  }
}

const handlePaste = (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

const saveHistory = () => {
  // Remove any history after current index
  history.value = history.value.slice(0, historyIndex.value + 1)
  
  // Add current state
  history.value.push(editor.value.innerHTML)
  
  // Limit history size
  if (history.value.length > maxHistorySize) {
    history.value.shift()
  } else {
    historyIndex.value++
  }
}

const undo = () => {
  if (canUndo.value) {
    historyIndex.value--
    editor.value.innerHTML = history.value[historyIndex.value]
    emit('update:modelValue', editor.value.innerHTML)
  }
}

const redo = () => {
  if (canRedo.value) {
    historyIndex.value++
    editor.value.innerHTML = history.value[historyIndex.value]
    emit('update:modelValue', editor.value.innerHTML)
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
  if (showPreview.value) {
    showHTML.value = false
  }
}

const toggleHTML = () => {
  showHTML.value = !showHTML.value
  if (showHTML.value) {
    showPreview.value = false
  }
}

const updateHTML = (html) => {
  editor.value.innerHTML = html
  emit('update:modelValue', html)
  saveHistory()
}

onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = props.modelValue || ''
    saveHistory()
    
    // Set placeholder
    if (!props.modelValue) {
      editor.value.setAttribute('data-placeholder', props.placeholder)
    }
  }
})

onBeforeUnmount(() => {
  history.value = []
})
</script>

<style scoped>
.toolbar-btn {
  @apply p-1.5 rounded hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.toolbar-btn.active {
  @apply bg-purple-100 text-purple-700;
}

[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
  display: block;
}

[contenteditable]:focus {
  @apply ring-2 ring-purple-500;
}
</style>