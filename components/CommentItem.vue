<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex space-x-3">
      <!-- User Avatar -->
      <img
        :src="comment.userAvatar"
        :alt="comment.userName"
        class="h-10 w-10 rounded-full flex-shrink-0"
      >
      
      <!-- Comment Content -->
      <div class="flex-grow">
        <!-- Header -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-gray-900">{{ comment.userName }}</span>
            <span class="text-sm text-gray-500">•</span>
            <time :datetime="comment.createdAt" class="text-sm text-gray-500">
              {{ formatDate(comment.createdAt) }}
            </time>
            <span v-if="comment.isEdited" class="text-xs text-gray-400">(edited)</span>
          </div>
          
          <!-- Actions Menu -->
          <div v-if="isAuthor" class="relative">
            <button
              @click="showMenu = !showMenu"
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showMenu"
              class="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10"
            >
              <button
                @click="startEdit"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', comment.id)"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <!-- Comment Text -->
        <div v-if="!isEditing" class="prose prose-sm max-w-none text-gray-700">
          <p class="whitespace-pre-wrap">{{ comment.content }}</p>
        </div>
        
        <!-- Edit Form -->
        <div v-else class="mt-2">
          <textarea
            v-model="editContent"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <div class="mt-2 flex space-x-2">
            <button
              @click="saveEdit"
              class="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
            <button
              @click="cancelEdit"
              class="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <!-- Actions Bar -->
        <div class="mt-3 flex items-center space-x-4">
          <!-- Like Button -->
          <button
            @click="$emit('like', comment.id)"
            :class="[
              'flex items-center space-x-1 text-sm transition-colors',
              comment.isLiked ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <svg
              class="h-4 w-4"
              :fill="comment.isLiked ? 'currentColor' : 'none'"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L10 18.364l5.682-5.682a4.5 4.5 0 00-6.364-6.364L10 7l-.682-.682a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{{ comment.likes }}</span>
          </button>
          
          <!-- Reply Button -->
          <button
            @click="showReplyForm = !showReplyForm"
            class="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span>Reply</span>
          </button>
        </div>
        
        <!-- Reply Form -->
        <div v-if="showReplyForm" class="mt-3">
          <div class="flex space-x-2">
            <input
              v-model="replyContent"
              type="text"
              placeholder="Write a reply..."
              class="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              @keyup.enter="submitReply"
            >
            <button
              @click="submitReply"
              :disabled="!replyContent.trim()"
              class="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reply
            </button>
            <button
              @click="cancelReply"
              class="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <!-- Replies -->
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-3">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="pl-4 border-l-2 border-gray-200"
          >
            <CommentItem
              :comment="reply"
              :current-user-id="currentUserId"
              :is-reply="true"
              @like="$emit('like', $event)"
              @delete="$emit('delete', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    default: null
  },
  isReply: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like', 'reply', 'edit', 'delete'])

const showMenu = ref(false)
const showReplyForm = ref(false)
const isEditing = ref(false)
const replyContent = ref('')
const editContent = ref('')

const isAuthor = computed(() => 
  props.currentUserId && props.comment.userId === props.currentUserId
)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const startEdit = () => {
  isEditing.value = true
  editContent.value = props.comment.content
  showMenu.value = false
}

const saveEdit = () => {
  if (editContent.value.trim() && editContent.value !== props.comment.content) {
    emit('edit', { commentId: props.comment.id, content: editContent.value.trim() })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

const submitReply = () => {
  if (replyContent.value.trim()) {
    emit('reply', { commentId: props.comment.id, content: replyContent.value.trim() })
    replyContent.value = ''
    showReplyForm.value = false
  }
}

const cancelReply = () => {
  replyContent.value = ''
  showReplyForm.value = false
}

// Close menu when clicking outside
if (process.client) {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showMenu.value = false
    }
  })
}
</script>