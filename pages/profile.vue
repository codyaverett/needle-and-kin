<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
          
          <!-- Profile Information -->
          <div class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <img
                  :src="userStore.userAvatar"
                  :alt="userStore.fullName"
                  class="h-20 w-20 rounded-full"
                >
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">{{ userStore.fullName }}</h2>
                  <p class="text-gray-600">@{{ userStore.username }}</p>
                  <p class="text-sm text-gray-500">{{ userStore.userEmail }}</p>
                  <p class="text-sm text-gray-500">Member since {{ formatDate(userStore.memberSince) }}</p>
                  <p v-if="userStore.currentUser?.role === 'admin'" class="text-sm font-medium text-purple-600">
                    Administrator
                  </p>
                  <p v-else-if="userStore.currentUser?.role === 'author'" class="text-sm font-medium text-pink-600">
                    Author
                  </p>
                </div>
              </div>
            </div>

            <!-- Change Password Section -->
            <div v-if="showChangePassword" class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <div v-if="userStore.currentUser?.mustChangePassword" class="mb-4 rounded-md bg-yellow-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">You must change your password</h3>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleChangePassword" class="space-y-4">
                <div>
                  <label for="current-password" class="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                </div>
                
                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                </div>
                
                <div>
                  <label for="confirm-new-password" class="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password"
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                </div>

                <div class="flex space-x-3">
                  <button
                    type="submit"
                    :disabled="changingPassword"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {{ changingPassword ? 'Changing...' : 'Change Password' }}
                  </button>
                  <button
                    v-if="!userStore.currentUser?.mustChangePassword"
                    type="button"
                    @click="showChangePassword = false"
                    class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Actions -->
            <div class="border-t pt-6 flex items-center justify-between">
              <div class="flex space-x-3">
                <button
                  v-if="!showChangePassword"
                  @click="showChangePassword = true"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Change Password
                </button>
                
                <NuxtLink
                  v-if="userStore.currentUser?.role === 'admin'"
                  to="/admin"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Admin Panel
                </NuxtLink>
              </div>
              
              <button
                @click="handleLogout"
                class="inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()
const uiStore = useUIStore()
const router = useRouter()
const route = useRoute()

const showChangePassword = ref(false)
const changingPassword = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  // Check if user was redirected here to change password
  if (route.query.changePassword === 'true' || userStore.currentUser?.mustChangePassword) {
    showChangePassword.value = true
  }
})

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    uiStore.showError('New passwords do not match')
    return
  }
  
  changingPassword.value = true
  
  try {
    await $fetch('/api/user/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    })
    
    uiStore.showSuccess('Password changed successfully')
    showChangePassword.value = false
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    // Update user store to reflect password change
    if (userStore.currentUser) {
      userStore.currentUser.mustChangePassword = false
    }
  } catch (error) {
    uiStore.showError(error.data?.message || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

useHead({
  title: 'My Profile - Needle & Kin',
  meta: [
    { name: 'description', content: 'Manage your Needle & Kin profile' }
  ]
})
</script>