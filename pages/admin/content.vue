<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Site Content Management</h2>
      <p class="mt-2 text-sm text-gray-600">
        Manage static content across your website including hero sections, about page, and other content blocks.
      </p>
    </div>

    <!-- Content Tabs -->
    <div class="bg-white rounded-lg shadow">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
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
        <!-- Hero Section -->
        <div v-if="activeTab === 'hero'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">Homepage Hero Section</h3>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                v-model="content.hero.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Welcome to Needle & Kin"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <textarea
                v-model="content.hero.subtitle"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Your creative community for all things crafting..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Call to Action Text
              </label>
              <input
                v-model="content.hero.ctaText"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Start Crafting Today"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Call to Action URL
              </label>
              <input
                v-model="content.hero.ctaUrl"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="/register"
              >
            </div>
          </div>
        </div>

        <!-- About Page -->
        <div v-if="activeTab === 'about'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">About Page Content</h3>
          
          <div class="space-y-6">
            <!-- Hero Section -->
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-4">Hero Section</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    v-model="content.about.hero.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    v-model="content.about.hero.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <!-- Story Section -->
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-4">Our Story</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    v-model="content.about.story.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div v-for="(paragraph, index) in content.about.story.content" :key="index">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Paragraph {{ index + 1 }}
                  </label>
                  <div class="flex gap-2">
                    <textarea
                      v-model="content.about.story.content[index]"
                      rows="3"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      @click="removeStoryParagraph(index)"
                      class="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  @click="addStoryParagraph"
                  class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Paragraph
                </button>
              </div>
            </div>

            <!-- Mission Section -->
            <div class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-4">Our Mission</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    v-model="content.about.mission.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div v-for="(value, index) in content.about.mission.values" :key="index" class="border rounded p-3">
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Value Title
                      </label>
                      <input
                        v-model="value.title"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Icon (book, users, lightbulb)
                      </label>
                      <select
                        v-model="value.icon"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="book">Book</option>
                        <option value="users">Users</option>
                        <option value="lightbulb">Lightbulb</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        v-model="value.description"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <button
                      @click="removeMissionValue(index)"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Value
                    </button>
                  </div>
                </div>
                <button
                  @click="addMissionValue"
                  class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Value
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div v-if="activeTab === 'features'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">Homepage Features</h3>
          
          <div class="space-y-4">
            <div v-for="(feature, index) in content.features" :key="index" class="border rounded-lg p-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Feature Title
                  </label>
                  <input
                    v-model="feature.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    v-model="feature.description"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Icon Name
                  </label>
                  <input
                    v-model="feature.icon"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., book-open, users, heart"
                  >
                </div>
                <button
                  @click="removeFeature(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  Remove Feature
                </button>
              </div>
            </div>
            
            <button
              @click="addFeature"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Feature
            </button>
          </div>
        </div>

        <!-- Footer Section -->
        <div v-if="activeTab === 'footer'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">Footer Content</h3>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Footer Description
              </label>
              <textarea
                v-model="content.footer.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                v-model="content.footer.copyright"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-3">Social Media Links</h4>
              <div class="space-y-3">
                <div v-for="(social, platform) in content.footer.social" :key="platform">
                  <label class="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {{ platform }}
                  </label>
                  <input
                    v-model="content.footer.social[platform]"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    :placeholder="`https://${platform}.com/yourhandle`"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8 flex justify-end space-x-4">
          <button
            @click="resetContent"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Reset Changes
          </button>
          <button
            @click="saveContent"
            :disabled="saving"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUIStore } from '~/stores/ui'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-admin'
})

const uiStore = useUIStore()

const tabs = [
  { id: 'hero', name: 'Hero Section' },
  { id: 'about', name: 'About Page' },
  { id: 'features', name: 'Features' },
  { id: 'footer', name: 'Footer' }
]

const activeTab = ref('hero')
const saving = ref(false)

// Initialize content with default values
const content = ref({
  hero: {
    title: 'Welcome to Needle & Kin',
    subtitle: 'Your creative community for all things crafting. Join thousands of makers sharing patterns, tutorials, and inspiration.',
    ctaText: 'Start Crafting Today',
    ctaUrl: '/register'
  },
  about: {
    hero: {
      title: 'About Needle & Kin',
      description: 'We are passionate crafters dedicated to building a vibrant community where creativity flourishes and makers connect.'
    },
    story: {
      title: 'Our Story',
      content: [
        'Needle & Kin was born from a simple idea: crafting is better together. What started as a small group of friends sharing patterns has grown into a thriving community of thousands.',
        'We believe that everyone has a creative spark waiting to be ignited. Our platform provides the tools, tutorials, and community support to help makers of all skill levels bring their ideas to life.'
      ]
    },
    mission: {
      title: 'Our Mission',
      values: [
        {
          title: 'Education',
          icon: 'book',
          description: 'Providing comprehensive tutorials and resources for crafters at every level.'
        },
        {
          title: 'Community',
          icon: 'users',
          description: 'Building connections between makers worldwide through shared passion.'
        },
        {
          title: 'Creativity',
          icon: 'lightbulb',
          description: 'Inspiring innovation and artistic expression in every project.'
        }
      ]
    },
    team: {
      title: 'Meet Our Team',
      description: 'Our dedicated team of crafting enthusiasts works tirelessly to create the best experience for our community.',
      members: []
    },
    cta: {
      title: 'Join Our Crafting Community',
      description: 'Start your creative journey today with thousands of patterns, tutorials, and fellow makers.',
      buttons: [
        { text: 'Get Started', url: '/register', type: 'primary' },
        { text: 'Browse Patterns', url: '/patterns', type: 'secondary' }
      ]
    }
  },
  features: [
    {
      title: 'Pattern Library',
      description: 'Access thousands of patterns for knitting, crochet, sewing, and more.',
      icon: 'book-open'
    },
    {
      title: 'Video Tutorials',
      description: 'Learn new techniques with our comprehensive video guides.',
      icon: 'play-circle'
    },
    {
      title: 'Community Forum',
      description: 'Connect with fellow crafters, share tips, and get inspired.',
      icon: 'users'
    },
    {
      title: 'Project Tracking',
      description: 'Keep track of your works in progress and completed projects.',
      icon: 'clipboard-list'
    }
  ],
  footer: {
    description: 'Your creative community for all things crafting.',
    copyright: '© 2024 Needle & Kin. All rights reserved.',
    social: {
      facebook: 'https://facebook.com/needleandkin',
      instagram: 'https://instagram.com/needleandkin',
      twitter: 'https://twitter.com/needleandkin',
      pinterest: 'https://pinterest.com/needleandkin'
    }
  }
})

// Load existing content
onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/content')
    if (response.data) {
      content.value = { ...content.value, ...response.data }
    }
  } catch (error) {
    console.error('Failed to load content:', error)
  }
})

// Add/Remove functions
const addStoryParagraph = () => {
  content.value.about.story.content.push('')
}

const removeStoryParagraph = (index) => {
  content.value.about.story.content.splice(index, 1)
}

const addMissionValue = () => {
  content.value.about.mission.values.push({
    title: '',
    icon: 'book',
    description: ''
  })
}

const removeMissionValue = (index) => {
  content.value.about.mission.values.splice(index, 1)
}

const addFeature = () => {
  content.value.features.push({
    title: '',
    description: '',
    icon: 'star'
  })
}

const removeFeature = (index) => {
  content.value.features.splice(index, 1)
}

// Save content
const saveContent = async () => {
  saving.value = true
  try {
    await $fetch('/api/admin/content', {
      method: 'POST',
      body: content.value
    })
    uiStore.showSuccess('Content saved successfully!')
  } catch (error) {
    uiStore.showError('Failed to save content')
  } finally {
    saving.value = false
  }
}

// Reset content
const resetContent = async () => {
  try {
    const response = await $fetch('/api/admin/content')
    if (response.data) {
      content.value = { ...content.value, ...response.data }
    }
    uiStore.showInfo('Content reset to last saved version')
  } catch (error) {
    uiStore.showError('Failed to reset content')
  }
}
</script>