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
            <span v-if="comment.isPinned" class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Pinned</span>
            <span v-if="comment.userRole === 'moderator'" class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Mod</span>
            <span v-if="comment.userRole === 'admin'" class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Admin</span>
            <span class="text-sm text-gray-500">•</span>
            <time :datetime="comment.createdAt" class="text-sm text-gray-500">
              {{ formatDate(comment.createdAt) }}
            </time>
            <span v-if="comment.isEdited" class="text-xs text-gray-400">(edited)</span>
          </div>
          
          <!-- Actions Menu -->
          <div v-if="isAuthor || isModerator" class="relative">
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
              class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10"
            >
              <button
                v-if="isAuthor"
                @click="startEdit"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                v-if="isModerator && !comment.isPinned"
                @click="$emit('pin', comment.id)"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg class="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 002 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                Pin Comment
              </button>
              <button
                v-if="isModerator && comment.isPinned"
                @click="$emit('unpin', comment.id)"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Unpin Comment
              </button>
              <button
                v-if="isModerator && !comment.isHidden"
                @click="$emit('hide', comment.id)"
                class="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
              >
                <svg class="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
                Hide Comment
              </button>
              <button
                v-if="isModerator && comment.isHidden"
                @click="$emit('unhide', comment.id)"
                class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
              >
                Show Comment
              </button>
              <button
                v-if="isModerator && !isAuthor"
                @click="$emit('report', comment.id)"
                class="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
              >
                Flag for Review
              </button>
              <hr v-if="isModerator || isAuthor" class="my-1" />
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
  currentUserRole: {
    type: String,
    default: 'user'
  },
  isReply: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like', 'reply', 'edit', 'delete', 'pin', 'unpin', 'hide', 'unhide', 'report'])

const showMenu = ref(false)
const showReplyForm = ref(false)
const isEditing = ref(false)
const replyContent = ref('')
const editContent = ref('')

const isAuthor = computed(() => 
  props.currentUserId && props.comment.userId === props.currentUserId
)

const isModerator = computed(() => 
  props.currentUserRole === 'moderator' || props.currentUserRole === 'admin'
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