<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Messages</h1>
        <p class="mt-2 text-gray-600">Manage and respond to contact form messages</p>
      </div>

      <!-- Status Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="currentStatus = tab.value"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              currentStatus === tab.value
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span class="ml-2 px-2 py-1 text-xs rounded-full" 
                  :class="tab.value === 'unread' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">
              {{ counts[tab.value] || 0 }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, subject, or message..."
            class="w-full md:w-96 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @input="debouncedSearch"
          >
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Submissions List -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p class="mt-2 text-gray-600">Loading submissions...</p>
      </div>

      <div v-else-if="submissions.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="mt-4 text-gray-600">No submissions found</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="submission in submissions"
          :key="submission.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ submission.subject }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="statusClasses[submission.status]"
                  >
                    {{ submission.status }}
                  </span>
                </div>
                
                <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ submission.name }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ submission.email }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(submission.createdAt) }}
                  </span>
                  <span v-if="submission.newsletter" class="flex items-center gap-1 text-green-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Newsletter
                  </span>
                </div>

                <p class="text-gray-700 line-clamp-2 mb-3">{{ submission.message }}</p>

                <div v-if="submission.responseMessage" class="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p class="text-sm font-medium text-blue-900 mb-1">Response sent {{ formatDate(submission.respondedAt) }}</p>
                  <p class="text-sm text-blue-800">{{ submission.responseMessage }}</p>
                  <p class="text-xs text-blue-600 mt-1">By: {{ submission.respondedBy }}</p>
                </div>

                <div v-if="submission.adminNotes" class="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p class="text-sm font-medium text-yellow-900 mb-1">Admin Notes</p>
                  <p class="text-sm text-yellow-800">{{ submission.adminNotes }}</p>
                </div>
              </div>

              <div class="ml-4 flex gap-2">
                <button
                  @click="viewSubmission(submission)"
                  class="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="View details"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  v-if="submission.status !== 'responded'"
                  @click="replyToSubmission(submission)"
                  class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Reply"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  @click="deleteSubmission(submission)"
                  class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="mt-8 flex justify-center">
        <nav class="flex gap-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg',
              page === pagination.page
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.pages"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>

    <!-- View/Reply Modal -->
    <Teleport to="body">
      <div v-if="selectedSubmission" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="closeModal">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="mb-4">
                <h3 class="text-2xl font-bold text-gray-900">{{ modalMode === 'view' ? 'Message Details' : 'Reply to Message' }}</h3>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">From</label>
                  <p class="mt-1 text-sm text-gray-900">{{ selectedSubmission.name }} ({{ selectedSubmission.email }})</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Subject</label>
                  <p class="mt-1 text-sm text-gray-900">{{ selectedSubmission.subject }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ selectedSubmission.message }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Submitted</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedSubmission.createdAt, true) }}</p>
                </div>

                <div v-if="modalMode === 'reply'" class="pt-4 border-t">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                  <textarea
                    v-model="responseMessage"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Type your response here..."
                  ></textarea>
                  
                  <div class="mt-3">
                    <label class="flex items-center">
                      <input
                        v-model="sendEmail"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">Send email to user</span>
                    </label>
                  </div>
                </div>

                <div v-if="modalMode === 'view'" class="pt-4 border-t">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Internal)</label>
                  <textarea
                    v-model="adminNotes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add internal notes..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                v-if="modalMode === 'reply'"
                @click="sendResponse"
                :disabled="!responseMessage.trim()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Response
              </button>
              <button
                v-if="modalMode === 'view'"
                @click="saveNotes"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Notes
              </button>
              <button
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ modalMode === 'view' ? 'Close' : 'Cancel' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const router = useRouter()

// Use the shared messages composable
const { unreadMessagesCount, updateUnreadCount, decrementUnreadCount } = useMessages()

const submissions = ref([])
const loading = ref(false)
const currentStatus = ref('all')
const searchQuery = ref('')
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 1
})
const counts = ref({
  all: 0,
  unread: 0,
  read: 0,
  responded: 0,
  archived: 0
})

const selectedSubmission = ref(null)
const modalMode = ref('view')
const responseMessage = ref('')
const adminNotes = ref('')
const sendEmail = ref(true)

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
  { label: 'Responded', value: 'responded' },
  { label: 'Archived', value: 'archived' }
]

const statusClasses = {
  unread: 'bg-red-100 text-red-800',
  read: 'bg-yellow-100 text-yellow-800',
  responded: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800'
}

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, pagination.value.page - half)
  let end = Math.min(pagination.value.pages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const fetchSubmissions = async () => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    
    if (currentStatus.value !== 'all') {
      params.append('status', currentStatus.value)
    }
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    const response = await $fetch(`/api/admin/contact-submissions?${params}`)
    
    submissions.value = response.submissions
    pagination.value = response.pagination
    counts.value = response.counts
    
    // Update the shared unread count
    updateUnreadCount(response.counts.unread || 0)
  } catch (error) {
    console.error('Error fetching submissions:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.pages) return
  pagination.value.page = page
  fetchSubmissions()
}

const viewSubmission = (submission) => {
  selectedSubmission.value = submission
  modalMode.value = 'view'
  adminNotes.value = submission.adminNotes || ''
  
  // Mark as read if unread
  if (submission.status === 'unread') {
    updateSubmissionStatus(submission.id, 'read')
    // Instantly decrement the unread count
    decrementUnreadCount()
  }
}

const replyToSubmission = (submission) => {
  selectedSubmission.value = submission
  modalMode.value = 'reply'
  responseMessage.value = ''
  sendEmail.value = true
}

const updateSubmissionStatus = async (id, status) => {
  try {
    await $fetch(`/api/admin/contact-submissions/${id}`, {
      method: 'PATCH',
      body: { status }
    })
    
    // Update local state
    const submission = submissions.value.find(s => s.id === id)
    if (submission) {
      const wasUnread = submission.status === 'unread'
      submission.status = status
      
      // Update counts locally for instant feedback
      if (wasUnread && status !== 'unread') {
        counts.value.unread = Math.max(0, counts.value.unread - 1)
        counts.value[status] = (counts.value[status] || 0) + 1
      }
    }
    
    // Refresh data from server
    fetchSubmissions()
  } catch (error) {
    console.error('Error updating submission status:', error)
  }
}

const sendResponse = async () => {
  if (!responseMessage.value.trim()) return
  
  try {
    const wasUnread = selectedSubmission.value.status === 'unread'
    
    await $fetch(`/api/admin/contact-submissions/${selectedSubmission.value.id}`, {
      method: 'PATCH',
      body: {
        responseMessage: responseMessage.value,
        sendEmail: sendEmail.value
      }
    })
    
    // If it was unread, decrement the count instantly
    if (wasUnread) {
      decrementUnreadCount()
    }
    
    closeModal()
    fetchSubmissions()
    
    // Show success message
    alert('Response sent successfully!')
  } catch (error) {
    console.error('Error sending response:', error)
    alert('Failed to send response')
  }
}

const saveNotes = async () => {
  try {
    await $fetch(`/api/admin/contact-submissions/${selectedSubmission.value.id}`, {
      method: 'PATCH',
      body: {
        adminNotes: adminNotes.value
      }
    })
    
    // Update local state
    selectedSubmission.value.adminNotes = adminNotes.value
    const submission = submissions.value.find(s => s.id === selectedSubmission.value.id)
    if (submission) {
      submission.adminNotes = adminNotes.value
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving notes:', error)
    alert('Failed to save notes')
  }
}

const deleteSubmission = async (submission) => {
  if (!confirm(`Are you sure you want to delete this submission from ${submission.name}?`)) {
    return
  }
  
  try {
    const wasUnread = submission.status === 'unread'
    
    await $fetch(`/api/admin/contact-submissions/${submission.id}`, {
      method: 'DELETE'
    })
    
    // If it was unread, decrement the count instantly
    if (wasUnread) {
      decrementUnreadCount()
    }
    
    fetchSubmissions()
  } catch (error) {
    console.error('Error deleting submission:', error)
    alert('Failed to delete submission')
  }
}

const closeModal = () => {
  selectedSubmission.value = null
  responseMessage.value = ''
  adminNotes.value = ''
  sendEmail.value = true
}

const formatDate = (date, includeTime = false) => {
  if (!date) return ''
  
  const d = new Date(date)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return d.toLocaleDateString('en-US', options)
}

let debounceTimer = null
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    pagination.value.page = 1
    fetchSubmissions()
  }, 300)
}

watch(currentStatus, () => {
  pagination.value.page = 1
  fetchSubmissions()
})

onMounted(() => {
  fetchSubmissions()
})
</script>