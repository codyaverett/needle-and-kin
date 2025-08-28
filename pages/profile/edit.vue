<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p class="text-gray-600 mt-2">Update your profile information and preferences</p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-green-800">{{ successMessage }}</p>
      </div>
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ errorMessage }}</p>
      </div>

      <!-- Profile Form -->
      <div class="bg-white rounded-lg shadow-md">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Basic Information Tab -->
          <div v-if="activeTab === 'basic'" class="space-y-6">
            <div class="flex items-center space-x-6">
              <div class="shrink-0 relative group">
                <img
                  :src="profile.avatar || '/avatars/default.jpg'"
                  alt="Profile"
                  class="h-20 w-20 rounded-full object-cover"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity">
                  <button
                    @click="showAvatarUpload = true"
                    type="button"
                    class="opacity-0 group-hover:opacity-100 text-white transition-opacity"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <button
                  @click="showAvatarUpload = true"
                  type="button"
                  class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Change Avatar
                </button>
                <p class="mt-1 text-sm text-gray-500">JPG, GIF or PNG. Max size 2MB</p>
                <button
                  v-if="profile.avatar && profile.avatar !== '/avatars/default.jpg'"
                  @click="removeAvatar"
                  type="button"
                  class="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove Avatar
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="profile.firstName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="profile.lastName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
              </div>
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                v-model="profile.username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
              <p class="mt-1 text-sm text-gray-500">This is how other users will see you</p>
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="profile.bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell us about yourself..."
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">{{ profile.bio?.length || 0 }}/500 characters</p>
            </div>
          </div>

          <!-- Crafting Profile Tab -->
          <div v-if="activeTab === 'crafting'" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>
              <div class="space-y-2">
                <label v-for="level in skillLevels" :key="level.value" class="flex items-center">
                  <input
                    type="radio"
                    v-model="craftingProfile.skillLevel"
                    :value="level.value"
                    class="mr-2 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="text-gray-700">{{ level.label }}</span>
                  <span class="ml-2 text-sm text-gray-500">{{ level.description }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="interest in availableInterests"
                  :key="interest"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    :value="interest"
                    v-model="craftingProfile.interests"
                    class="mr-2 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="text-gray-700 capitalize">{{ interest }}</span>
                </label>
              </div>
            </div>

            <div>
              <label for="tools" class="block text-sm font-medium text-gray-700 mb-1">
                Tools & Equipment
              </label>
              <input
                id="tools"
                v-model="toolsInput"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Knitting needles, Crochet hooks (comma separated)"
              >
            </div>

            <div>
              <label for="materials" class="block text-sm font-medium text-gray-700 mb-1">
                Favorite Materials
              </label>
              <input
                id="materials"
                v-model="materialsInput"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Merino wool, Cotton thread (comma separated)"
              >
            </div>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="preferences.newsletter"
                    class="mr-3 text-purple-600 focus:ring-purple-500"
                  >
                  <div>
                    <span class="text-gray-700">Newsletter</span>
                    <p class="text-sm text-gray-500">Receive our weekly crafting newsletter</p>
                  </div>
                </label>

                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="preferences.emailNotifications"
                    class="mr-3 text-purple-600 focus:ring-purple-500"
                  >
                  <div>
                    <span class="text-gray-700">Email Notifications</span>
                    <p class="text-sm text-gray-500">Get notified about comments and likes</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Favorite Categories</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="category in categories"
                  :key="category"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    :value="category"
                    v-model="preferences.favoriteCategories"
                    class="mr-2 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="text-gray-700 capitalize">{{ category }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveProfile"
            :disabled="isSaving"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <Teleport to="body">
      <div v-if="showAvatarUpload" class="fixed inset-0 z-50 overflow-hidden">
        <div @click="showAvatarUpload = false" class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
        
        <div class="fixed inset-0 overflow-hidden">
          <div class="flex items-center justify-center min-h-full p-4">
            <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <!-- Modal Header -->
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-semibold text-gray-900">Upload Avatar</h2>
                  <button
                    @click="showAvatarUpload = false"
                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="p-6">
                <MediaUpload
                  :accept="'image/*'"
                  :multiple="false"
                  :max-size="2097152"
                  :auto-upload="false"
                  @select="handleAvatarSelect"
                  @uploaded="handleAvatarUploaded"
                />
              </div>

              <!-- Modal Footer -->
              <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                <button
                  @click="showAvatarUpload = false"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="uploadSelectedAvatar"
                  :disabled="!selectedAvatarFile"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Set as Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()

const activeTab = ref('basic')
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showAvatarUpload = ref(false)
const selectedAvatarFile = ref(null)

const tabs = [
  { id: 'basic', name: 'Basic Information' },
  { id: 'crafting', name: 'Crafting Profile' },
  { id: 'preferences', name: 'Preferences' }
]

const profile = ref({
  firstName: '',
  lastName: '',
  username: '',
  bio: '',
  avatar: ''
})

const craftingProfile = ref({
  skillLevel: 'beginner',
  interests: [],
  tools: [],
  materials: []
})

const preferences = ref({
  newsletter: false,
  emailNotifications: true,
  favoriteCategories: []
})

const skillLevels = [
  { value: 'beginner', label: 'Beginner', description: '(Less than 1 year)' },
  { value: 'intermediate', label: 'Intermediate', description: '(1-5 years)' },
  { value: 'advanced', label: 'Advanced', description: '(5+ years)' }
]

const availableInterests = [
  'knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 'weaving',
  'pattern design', 'dyeing', 'spinning', 'felting'
]

const categories = [
  'knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 'weaving'
]

const toolsInput = computed({
  get: () => craftingProfile.value.tools.join(', '),
  set: (val) => {
    craftingProfile.value.tools = val.split(',').map(t => t.trim()).filter(t => t)
  }
})

const materialsInput = computed({
  get: () => craftingProfile.value.materials.join(', '),
  set: (val) => {
    craftingProfile.value.materials = val.split(',').map(m => m.trim()).filter(m => m)
  }
})

onMounted(async () => {
  // Load current user data
  if (userStore.currentUser) {
    profile.value = {
      firstName: userStore.currentUser.firstName || '',
      lastName: userStore.currentUser.lastName || '',
      username: userStore.currentUser.username || '',
      bio: userStore.currentUser.bio || '',
      avatar: userStore.currentUser.avatar || ''
    }
  }
  
  // Load preferences and crafting profile
  try {
    const [prefsData, craftingData] = await Promise.all([
      $fetch('/api/user/preferences'),
      $fetch('/api/user/crafting-profile')
    ])
    
    if (prefsData.preferences) {
      preferences.value = prefsData.preferences
    }
    
    if (craftingData.craftingProfile) {
      craftingProfile.value = craftingData.craftingProfile
    }
  } catch (error) {
    console.error('Error loading profile data:', error)
  }
})

const saveProfile = async () => {
  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    // Save all sections
    const promises = []
    
    // Save basic profile
    if (activeTab.value === 'basic') {
      promises.push($fetch('/api/user/profile', {
        method: 'PUT',
        body: profile.value
      }))
    }
    
    // Save crafting profile
    if (activeTab.value === 'crafting') {
      promises.push($fetch('/api/user/crafting-profile', {
        method: 'PUT',
        body: craftingProfile.value
      }))
    }
    
    // Save preferences
    if (activeTab.value === 'preferences') {
      promises.push($fetch('/api/user/preferences', {
        method: 'PUT',
        body: preferences.value
      }))
    }
    
    await Promise.all(promises)
    
    successMessage.value = 'Profile updated successfully!'
    
    // Update store
    await userStore.fetchProfile()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error saving profile:', error)
    errorMessage.value = 'Failed to save profile. Please try again.'
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  // Reset to original values
  navigateTo('/profile')
}

const handleAvatarSelect = (files) => {
  if (files.length > 0) {
    selectedAvatarFile.value = files[0]
  }
}

const handleAvatarUploaded = (uploadedFiles) => {
  if (uploadedFiles.length > 0) {
    profile.value.avatar = uploadedFiles[0].url
    showAvatarUpload.value = false
    selectedAvatarFile.value = null
    
    // Save the profile with new avatar
    saveProfile()
  }
}

const uploadSelectedAvatar = async () => {
  if (selectedAvatarFile.value && selectedAvatarFile.value.preview) {
    // In a real app, upload to server
    // For now, use the preview as the avatar
    profile.value.avatar = selectedAvatarFile.value.preview
    showAvatarUpload.value = false
    selectedAvatarFile.value = null
    
    // Save the profile with new avatar
    saveProfile()
  }
}

const removeAvatar = () => {
  profile.value.avatar = '/avatars/default.jpg'
  // Save the profile with default avatar
  saveProfile()
}

useHead({
  title: 'Edit Profile - Needle & Kin'
})
</script>