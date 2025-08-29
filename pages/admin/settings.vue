<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">System Settings</h2>
      <p class="mt-2 text-sm text-gray-600">
        Configure your application settings, email configuration, security options, and more.
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- General Settings -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">General Settings</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                v-model="settings.general.siteName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Needle & Kin"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <input
                v-model="settings.general.siteUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://needleandkin.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                v-model="settings.general.contactEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="contact@needleandkin.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                v-model="settings.general.supportEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="support@needleandkin.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <select
                v-model="settings.general.defaultLanguage"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                v-model="settings.general.timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              v-model="settings.general.siteDescription"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Your creative community for all things crafting..."
            />
          </div>
        </div>
      </div>

      <!-- Email Configuration -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Email Configuration</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                v-model="settings.email.smtpHost"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="smtp.gmail.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                v-model="settings.email.smtpPort"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="587"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Username
              </label>
              <input
                v-model="settings.email.smtpUsername"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="your-email@gmail.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                SMTP Password
              </label>
              <input
                v-model="settings.email.smtpPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <input
                v-model="settings.email.fromEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="noreply@needleandkin.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                v-model="settings.email.fromName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Needle & Kin"
              >
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <input
              id="email-tls"
              v-model="settings.email.useTLS"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label for="email-tls" class="text-sm text-gray-700">
              Use TLS/STARTTLS encryption
            </label>
          </div>

          <div class="flex justify-end">
            <button
              @click="testEmailConnection"
              :disabled="testingEmail"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {{ testingEmail ? 'Testing...' : 'Test Connection' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p class="text-sm text-gray-500">Require 2FA for admin accounts</p>
              </div>
              <button
                @click="settings.security.require2FA = !settings.security.require2FA"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.security.require2FA ? 'bg-purple-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.security.require2FA ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Account Lockout</h4>
                <p class="text-sm text-gray-500">Lock accounts after failed login attempts</p>
              </div>
              <button
                @click="settings.security.enableLockout = !settings.security.enableLockout"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.security.enableLockout ? 'bg-purple-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.security.enableLockout ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <div v-if="settings.security.enableLockout" class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  v-model.number="settings.security.maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Lockout Duration (minutes)
                </label>
                <input
                  v-model.number="settings.security.lockoutDuration"
                  type="number"
                  min="5"
                  max="60"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Password Expiry</h4>
                <p class="text-sm text-gray-500">Require users to change passwords periodically</p>
              </div>
              <button
                @click="settings.security.passwordExpiry = !settings.security.passwordExpiry"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.security.passwordExpiry ? 'bg-purple-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.security.passwordExpiry ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <div v-if="settings.security.passwordExpiry">
              <label class="block text-sm font-medium text-gray-700 mb-2 ml-8">
                Password Expiry Days
              </label>
              <input
                v-model.number="settings.security.passwordExpiryDays"
                type="number"
                min="30"
                max="365"
                class="w-full md:w-1/2 ml-8 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Session Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  v-model.number="settings.security.sessionTimeout"
                  type="number"
                  min="15"
                  max="1440"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Remember Me Duration (days)
                </label>
                <input
                  v-model.number="settings.security.rememberMeDuration"
                  type="number"
                  min="1"
                  max="90"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO Settings -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">SEO Settings</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Meta Title Template
              </label>
              <input
                v-model="settings.seo.titleTemplate"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="%s | Needle & Kin"
              >
              <p class="mt-1 text-xs text-gray-500">Use %s as placeholder for page title</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Default Meta Image
              </label>
              <input
                v-model="settings.seo.defaultImage"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="/images/og-image.jpg"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Default Meta Description
            </label>
            <textarea
              v-model="settings.seo.defaultDescription"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Default description for pages without specific descriptions..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              v-model="settings.seo.keywords"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="crafting, knitting, crochet, sewing, DIY"
            >
          </div>

          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900">Social Media</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Handle
                </label>
                <input
                  v-model="settings.seo.twitterHandle"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="@needleandkin"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Facebook App ID
                </label>
                <input
                  v-model="settings.seo.facebookAppId"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="1234567890"
                >
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <input
              id="enable-sitemap"
              v-model="settings.seo.enableSitemap"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label for="enable-sitemap" class="text-sm text-gray-700">
              Generate XML Sitemap
            </label>
          </div>

          <div class="flex items-center space-x-3">
            <input
              id="enable-robots"
              v-model="settings.seo.enableRobotsTxt"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label for="enable-robots" class="text-sm text-gray-700">
              Generate robots.txt
            </label>
          </div>
        </div>
      </div>

      <!-- Analytics Settings -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Analytics & Tracking</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                v-model="settings.analytics.googleAnalyticsId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="G-XXXXXXXXXX"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Google Tag Manager ID
              </label>
              <input
                v-model="settings.analytics.googleTagManagerId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="GTM-XXXXXXX"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Facebook Pixel ID
              </label>
              <input
                v-model="settings.analytics.facebookPixelId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="1234567890"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hotjar Site ID
              </label>
              <input
                v-model="settings.analytics.hotjarId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="1234567"
              >
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <input
              id="enable-analytics"
              v-model="settings.analytics.enableTracking"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label for="enable-analytics" class="text-sm text-gray-700">
              Enable analytics tracking
            </label>
          </div>

          <div class="flex items-center space-x-3">
            <input
              id="anonymize-ip"
              v-model="settings.analytics.anonymizeIp"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label for="anonymize-ip" class="text-sm text-gray-700">
              Anonymize IP addresses (GDPR compliance)
            </label>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end space-x-4">
        <button
          @click="resetSettings"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Reset Changes
        </button>
        <button
          @click="saveSettings"
          :disabled="saving"
          class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
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

const saving = ref(false)
const testingEmail = ref(false)

// Initialize settings with default values
const settings = ref({
  general: {
    siteName: 'Needle & Kin',
    siteUrl: 'https://needleandkin.com',
    contactEmail: 'contact@needleandkin.com',
    supportEmail: 'support@needleandkin.com',
    defaultLanguage: 'en',
    timezone: 'America/New_York',
    siteDescription: 'Your creative community for all things crafting'
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@needleandkin.com',
    fromName: 'Needle & Kin',
    useTLS: true
  },
  security: {
    require2FA: false,
    enableLockout: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    passwordExpiry: false,
    passwordExpiryDays: 90,
    sessionTimeout: 60,
    rememberMeDuration: 30
  },
  seo: {
    titleTemplate: '%s | Needle & Kin',
    defaultDescription: 'Join our crafting community to share patterns, tutorials, and connect with fellow makers.',
    defaultImage: '/images/og-image.jpg',
    keywords: 'crafting, knitting, crochet, sewing, DIY, patterns, tutorials',
    twitterHandle: '@needleandkin',
    facebookAppId: '',
    enableSitemap: true,
    enableRobotsTxt: true
  },
  analytics: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    hotjarId: '',
    enableTracking: false,
    anonymizeIp: true
  }
})

// Load existing settings
onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/settings')
    if (response.data) {
      settings.value = { ...settings.value, ...response.data }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
})

// Test email connection
const testEmailConnection = async () => {
  testingEmail.value = true
  try {
    const response = await $fetch('/api/admin/settings/test-email', {
      method: 'POST',
      body: settings.value.email
    })
    if (response.success) {
      uiStore.showSuccess('Email connection successful!')
    } else {
      uiStore.showError('Email connection failed')
    }
  } catch (error) {
    uiStore.showError('Failed to test email connection')
  } finally {
    testingEmail.value = false
  }
}

// Save settings
const saveSettings = async () => {
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'POST',
      body: settings.value
    })
    uiStore.showSuccess('Settings saved successfully!')
  } catch (error) {
    uiStore.showError('Failed to save settings')
  } finally {
    saving.value = false
  }
}

// Reset settings
const resetSettings = async () => {
  try {
    const response = await $fetch('/api/admin/settings')
    if (response.data) {
      settings.value = { ...settings.value, ...response.data }
    }
    uiStore.showInfo('Settings reset to last saved version')
  } catch (error) {
    uiStore.showError('Failed to reset settings')
  }
}
</script>