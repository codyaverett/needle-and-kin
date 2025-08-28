<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p class="text-gray-600 mt-2">Manage your account security and privacy settings</p>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-green-800">{{ successMessage }}</p>
        </div>
      </div>
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-red-800">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- Email & Password -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Email & Password</h2>
          
          <!-- Email -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div class="flex items-center space-x-3">
              <input
                id="email"
                v-model="email"
                type="email"
                disabled
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              >
              <button
                @click="showEmailModal = true"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Change Email
              </button>
            </div>
            <p v-if="!emailVerified" class="mt-2 text-sm text-amber-600">
              <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Email not verified. <button @click="sendVerificationEmail" class="underline">Send verification email</button>
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <button
              @click="showPasswordModal = true"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Change Password
            </button>
            <p class="mt-2 text-sm text-gray-500">
              Last changed: {{ formatDate(lastPasswordChange) }}
            </p>
          </div>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
              <p class="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
            </div>
            <span
              v-if="twoFactorEnabled"
              class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              Enabled
            </span>
          </div>
          
          <div v-if="!twoFactorEnabled" class="space-y-4">
            <p class="text-gray-600">
              Two-factor authentication adds an additional layer of security to your account by requiring a verification code in addition to your password.
            </p>
            <button
              @click="show2FAModal = true"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Enable Two-Factor Authentication
            </button>
          </div>
          <div v-else class="space-y-4">
            <div class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">Two-factor authentication is active</span>
            </div>
            <div class="flex space-x-3">
              <button
                @click="showBackupCodes"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Backup Codes
              </button>
              <button
                @click="disable2FA"
                class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
          
          <div class="space-y-4">
            <label class="flex items-center justify-between">
              <div>
                <span class="text-gray-700">Show profile publicly</span>
                <p class="text-sm text-gray-500">Allow others to view your profile and posts</p>
              </div>
              <input
                v-model="privacy.publicProfile"
                type="checkbox"
                class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              >
            </label>

            <label class="flex items-center justify-between">
              <div>
                <span class="text-gray-700">Show email address</span>
                <p class="text-sm text-gray-500">Display your email on your public profile</p>
              </div>
              <input
                v-model="privacy.showEmail"
                type="checkbox"
                class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              >
            </label>

            <label class="flex items-center justify-between">
              <div>
                <span class="text-gray-700">Allow messages from non-followers</span>
                <p class="text-sm text-gray-500">Receive messages from users who don't follow you</p>
              </div>
              <input
                v-model="privacy.allowMessages"
                type="checkbox"
                class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              >
            </label>

            <label class="flex items-center justify-between">
              <div>
                <span class="text-gray-700">Show in user directory</span>
                <p class="text-sm text-gray-500">Appear in public user searches and listings</p>
              </div>
              <input
                v-model="privacy.showInDirectory"
                type="checkbox"
                class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              >
            </label>
          </div>

          <button
            @click="savePrivacySettings"
            class="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Privacy Settings
          </button>
        </div>

        <!-- Connected Accounts -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Connected Accounts</h2>
          
          <div class="space-y-4">
            <!-- Google -->
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-600" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Google</p>
                  <p class="text-sm text-gray-500">{{ connectedAccounts.google ? 'Connected' : 'Not connected' }}</p>
                </div>
              </div>
              <button
                v-if="!connectedAccounts.google"
                @click="connectGoogle"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Connect
              </button>
              <button
                v-else
                @click="disconnectGoogle"
                class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            </div>

            <!-- GitHub -->
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">GitHub</p>
                  <p class="text-sm text-gray-500">{{ connectedAccounts.github ? 'Connected' : 'Not connected' }}</p>
                </div>
              </div>
              <button
                v-if="!connectedAccounts.github"
                @click="connectGithub"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Connect
              </button>
              <button
                v-else
                @click="disconnectGithub"
                class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>

        <!-- Sessions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Active Sessions</h2>
          
          <div class="space-y-4">
            <div
              v-for="session in activeSessions"
              :key="session.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ session.device }}
                    <span v-if="session.isCurrent" class="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Current</span>
                  </p>
                  <p class="text-sm text-gray-500">{{ session.location }} • Last active {{ formatRelativeTime(session.lastActive) }}</p>
                </div>
              </div>
              <button
                v-if="!session.isCurrent"
                @click="revokeSession(session.id)"
                class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
          <h2 class="text-xl font-semibold text-red-600 mb-6">Danger Zone</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Delete Account</p>
                <p class="text-sm text-gray-500">Permanently delete your account and all associated data</p>
              </div>
              <button
                @click="showDeleteModal = true"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 overflow-hidden">
        <div @click="showPasswordModal = false" class="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
        <div class="fixed inset-0 overflow-hidden">
          <div class="flex items-center justify-center min-h-full p-4">
            <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    v-model="passwordForm.current"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    v-model="passwordForm.new"
                    type="password"
                    required
                    minlength="8"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirm"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    @click="showPasswordModal = false"
                    type="button"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()

const email = ref('')
const emailVerified = ref(false)
const lastPasswordChange = ref(new Date())
const twoFactorEnabled = ref(false)
const showPasswordModal = ref(false)
const showEmailModal = ref(false)
const show2FAModal = ref(false)
const showDeleteModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const privacy = ref({
  publicProfile: true,
  showEmail: false,
  allowMessages: true,
  showInDirectory: true
})

const connectedAccounts = ref({
  google: false,
  github: false
})

const activeSessions = ref([
  {
    id: '1',
    device: 'Chrome on MacOS',
    location: 'San Francisco, CA',
    lastActive: new Date(),
    isCurrent: true
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'San Francisco, CA',
    lastActive: new Date(Date.now() - 3600000),
    isCurrent: false
  }
])

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatRelativeTime = (date) => {
  const diff = Date.now() - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const sendVerificationEmail = async () => {
  try {
    // Send verification email
    successMessage.value = 'Verification email sent! Please check your inbox.'
    setTimeout(() => successMessage.value = '', 5000)
  } catch (error) {
    errorMessage.value = 'Failed to send verification email'
    setTimeout(() => errorMessage.value = '', 5000)
  }
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    errorMessage.value = 'New passwords do not match'
    setTimeout(() => errorMessage.value = '', 5000)
    return
  }
  
  try {
    // Change password API call
    successMessage.value = 'Password changed successfully!'
    showPasswordModal.value = false
    passwordForm.value = { current: '', new: '', confirm: '' }
    lastPasswordChange.value = new Date()
    setTimeout(() => successMessage.value = '', 5000)
  } catch (error) {
    errorMessage.value = 'Failed to change password'
    setTimeout(() => errorMessage.value = '', 5000)
  }
}

const savePrivacySettings = async () => {
  try {
    // Save privacy settings
    successMessage.value = 'Privacy settings updated successfully!'
    setTimeout(() => successMessage.value = '', 5000)
  } catch (error) {
    errorMessage.value = 'Failed to save privacy settings'
    setTimeout(() => errorMessage.value = '', 5000)
  }
}

const disable2FA = async () => {
  if (confirm('Are you sure you want to disable two-factor authentication?')) {
    try {
      twoFactorEnabled.value = false
      successMessage.value = 'Two-factor authentication disabled'
      setTimeout(() => successMessage.value = '', 5000)
    } catch (error) {
      errorMessage.value = 'Failed to disable 2FA'
      setTimeout(() => errorMessage.value = '', 5000)
    }
  }
}

const revokeSession = async (sessionId) => {
  if (confirm('Are you sure you want to revoke this session?')) {
    try {
      activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId)
      successMessage.value = 'Session revoked successfully'
      setTimeout(() => successMessage.value = '', 5000)
    } catch (error) {
      errorMessage.value = 'Failed to revoke session'
      setTimeout(() => errorMessage.value = '', 5000)
    }
  }
}

const connectGoogle = () => {
  // OAuth flow for Google
  window.location.href = '/api/auth/google'
}

const disconnectGoogle = async () => {
  if (confirm('Are you sure you want to disconnect your Google account?')) {
    connectedAccounts.value.google = false
    successMessage.value = 'Google account disconnected'
    setTimeout(() => successMessage.value = '', 5000)
  }
}

const connectGithub = () => {
  // OAuth flow for GitHub
  window.location.href = '/api/auth/github'
}

const disconnectGithub = async () => {
  if (confirm('Are you sure you want to disconnect your GitHub account?')) {
    connectedAccounts.value.github = false
    successMessage.value = 'GitHub account disconnected'
    setTimeout(() => successMessage.value = '', 5000)
  }
}

const showBackupCodes = () => {
  // Show backup codes modal
  alert('Backup codes: XXXX-XXXX, YYYY-YYYY, ZZZZ-ZZZZ')
}

onMounted(() => {
  // Load user settings
  if (userStore.currentUser) {
    email.value = userStore.currentUser.email || ''
    emailVerified.value = userStore.currentUser.emailVerified || false
  }
})

useHead({
  title: 'Account Settings - Needle & Kin'
})
</script>