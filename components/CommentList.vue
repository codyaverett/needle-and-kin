<template>
  <div class="space-y-6">
    <!-- Comments Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Comments ({{ totalComments }})
      </h3>
      <div class="flex items-center space-x-2">
        <label for="sort" class="text-sm text-gray-600">Sort by:</label>
        <select
          id="sort"
          v-model="sortBy"
          @change="$emit('sort-change', sortBy)"
          class="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>

    <!-- Comment Form (for authenticated users) -->
    <div v-if="isAuthenticated" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <form @submit.prevent="submitComment">
        <div class="flex space-x-3">
          <img
            :src="currentUser?.avatar || '/avatars/default.jpg'"
            :alt="currentUser?.name"
            class="h-10 w-10 rounded-full flex-shrink-0"
          >
          <div class="flex-grow">
            <textarea
              v-model="newComment"
              :placeholder="`Add a comment...`"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              :disabled="isSubmitting"
            ></textarea>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-sm text-gray-500">
                {{ newComment.length }}/2000 characters
              </span>
              <button
                type="submit"
                :disabled="!newComment.trim() || isSubmitting"
                class="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Login Prompt (for non-authenticated users) -->
    <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
      <p class="text-gray-600 mb-3">Join the conversation!</p>
      <NuxtLink
        to="/login"
        class="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Login to Comment
      </NuxtLink>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="space-y-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :current-user-id="currentUser?.id"
        @like="handleLike"
        @reply="handleReply"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p class="mt-4 text-gray-500">No comments yet. Be the first to share your thoughts!</p>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" class="text-center pt-4">
      <button
        @click="$emit('load-more')"
        :disabled="isLoadingMore"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isLoadingMore ? 'Loading...' : 'Load More Comments' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import CommentItem from '~/components/CommentItem.vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  totalComments: {
    type: Number,
    default: 0
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  },
  postId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits([
  'submit-comment',
  'sort-change',
  'load-more',
  'like-comment',
  'reply-comment',
  'edit-comment',
  'delete-comment'
])

const userStore = useUserStore()

const sortBy = ref('newest')
const newComment = ref('')
const isSubmitting = ref(false)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const currentUser = computed(() => userStore.currentUser)

const submitComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const response = await $fetch(`/api/posts/${props.postId}/comments`, {
      method: 'POST',
      body: {
        content: newComment.value.trim()
      }
    })
    
    if (response.success) {
      emit('submit-comment', response.comment)
      newComment.value = ''
    }
  } catch (error) {
    console.error('Error posting comment:', error)
    // Show error message
  } finally {
    isSubmitting.value = false
  }
}

const handleLike = (commentId) => {
  emit('like-comment', commentId)
}

const handleReply = ({ commentId, content }) => {
  emit('reply-comment', { commentId, content })
}

const handleEdit = ({ commentId, content }) => {
  emit('edit-comment', { commentId, content })
}

const handleDelete = (commentId) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    emit('delete-comment', commentId)
  }
}
</script>