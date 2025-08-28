<template>
  <div class="media-upload">
    <!-- Upload Area -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @dragleave="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-all',
        isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptedFormats"
        :multiple="multiple"
        @change="handleFileSelect"
        class="hidden"
      >
      
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      
      <p class="mt-2 text-sm text-gray-600">
        <button
          @click="$refs.fileInput.click()"
          type="button"
          class="text-purple-600 hover:text-purple-700 font-medium"
        >
          Click to upload
        </button>
        or drag and drop
      </p>
      <p class="text-xs text-gray-500 mt-1">
        {{ formatAcceptedTypes }}
      </p>
      <p v-if="maxSize" class="text-xs text-gray-500">
        Max file size: {{ formatFileSize(maxSize) }}
      </p>
    </div>

    <!-- Preview Grid -->
    <div v-if="files.length > 0" class="mt-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-900">
          {{ files.length }} file{{ files.length !== 1 ? 's' : '' }} selected
        </h3>
        <button
          @click="clearAll"
          type="button"
          class="text-sm text-red-600 hover:text-red-700"
        >
          Clear all
        </button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="relative group"
        >
          <!-- Image Preview -->
          <div v-if="file.type.startsWith('image/')" class="relative">
            <img
              :src="file.preview"
              :alt="file.name"
              class="w-full h-32 object-cover rounded-lg"
            >
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
              <button
                @click="removeFile(index)"
                type="button"
                class="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-opacity"
              >
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- File Icon for Non-Images -->
          <div v-else class="relative bg-gray-100 rounded-lg p-4 h-32 flex flex-col items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clip-rule="evenodd" />
            </svg>
            <button
              @click="removeFile(index)"
              type="button"
              class="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <!-- File Info -->
          <div class="mt-2">
            <p class="text-xs text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            
            <!-- Upload Progress -->
            <div v-if="file.uploading" class="mt-1">
              <div class="bg-gray-200 rounded-full h-1 overflow-hidden">
                <div
                  :style="{ width: `${file.progress}%` }"
                  class="bg-purple-600 h-full transition-all duration-300"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ file.progress }}%</p>
            </div>
            
            <!-- Upload Status -->
            <div v-if="file.uploaded" class="mt-1 flex items-center text-green-600">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs">Uploaded</span>
            </div>
            
            <!-- Upload Error -->
            <div v-if="file.error" class="mt-1 flex items-center text-red-600">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs">{{ file.error }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="files.length > 0 && !autoUpload" class="mt-6 flex justify-end">
      <button
        @click="uploadAll"
        :disabled="isUploading"
        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {{ isUploading ? 'Uploading...' : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  autoUpload: {
    type: Boolean,
    default: false
  },
  uploadUrl: {
    type: String,
    default: '/api/media/upload'
  }
})

const emit = defineEmits(['uploaded', 'error', 'select'])

const files = ref([])
const isDragging = ref(false)
const isUploading = ref(false)
const fileInput = ref(null)

const acceptedFormats = computed(() => props.accept)

const formatAcceptedTypes = computed(() => {
  const types = props.accept.split(',').map(t => t.trim())
  if (types.includes('image/*')) return 'PNG, JPG, GIF, WebP up to 5MB'
  if (types.includes('video/*')) return 'MP4, MOV, AVI up to 50MB'
  if (types.includes('*/*')) return 'All file types'
  return types.join(', ')
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const validateFile = (file) => {
  // Check file size
  if (props.maxSize && file.size > props.maxSize) {
    return `File size exceeds ${formatFileSize(props.maxSize)}`
  }
  
  // Check file type
  if (props.accept !== '*/*') {
    const acceptedTypes = props.accept.split(',').map(t => t.trim())
    const fileType = file.type
    const fileExtension = '.' + file.name.split('.').pop()
    
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0]
        return fileType.startsWith(category + '/')
      }
      return type === fileType || type === fileExtension
    })
    
    if (!isAccepted) {
      return 'File type not accepted'
    }
  }
  
  return null
}

const createPreview = (file) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const droppedFiles = Array.from(e.dataTransfer.files)
  processFiles(droppedFiles)
}

const handleFileSelect = (e) => {
  const selectedFiles = Array.from(e.target.files)
  processFiles(selectedFiles)
}

const processFiles = async (newFiles) => {
  const processedFiles = []
  
  for (const file of newFiles) {
    const error = validateFile(file)
    const preview = await createPreview(file)
    
    processedFiles.push({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview,
      error,
      uploading: false,
      uploaded: false,
      progress: 0
    })
  }
  
  if (props.multiple) {
    files.value = [...files.value, ...processedFiles]
  } else {
    files.value = processedFiles.slice(0, 1)
  }
  
  emit('select', files.value)
  
  if (props.autoUpload) {
    uploadAll()
  }
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const clearAll = () => {
  files.value = []
}

const uploadFile = async (fileItem) => {
  fileItem.uploading = true
  fileItem.progress = 0
  
  const formData = new FormData()
  formData.append('file', fileItem.file)
  
  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (fileItem.progress < 90) {
        fileItem.progress += Math.random() * 30
      }
    }, 500)
    
    const response = await $fetch(props.uploadUrl, {
      method: 'POST',
      body: formData,
      onUploadProgress: (progress) => {
        fileItem.progress = Math.round((progress.loaded / progress.total) * 100)
      }
    })
    
    clearInterval(progressInterval)
    fileItem.progress = 100
    fileItem.uploading = false
    fileItem.uploaded = true
    fileItem.url = response.url
    
    return response
  } catch (error) {
    fileItem.uploading = false
    fileItem.error = 'Upload failed'
    throw error
  }
}

const uploadAll = async () => {
  isUploading.value = true
  const uploadedFiles = []
  const errors = []
  
  for (const fileItem of files.value) {
    if (fileItem.uploaded || fileItem.error) continue
    
    try {
      const result = await uploadFile(fileItem)
      uploadedFiles.push(result)
    } catch (error) {
      errors.push({ file: fileItem.name, error })
    }
  }
  
  isUploading.value = false
  
  if (uploadedFiles.length > 0) {
    emit('uploaded', uploadedFiles)
  }
  
  if (errors.length > 0) {
    emit('error', errors)
  }
}
</script>