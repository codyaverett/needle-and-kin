<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="font-medium text-purple-600 hover:text-purple-500">
            sign in to existing account
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="first-name"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Jane"
              >
            </div>
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="last-name"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Doe"
              >
            </div>
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="janedoe (optional)"
            >
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="jane@example.com"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              @input="checkPasswordStrength"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Minimum 8 characters"
            >
            
            <!-- Password strength indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex items-center justify-between text-xs">
                <span>Password strength:</span>
                <span :class="passwordStrengthClass">{{ passwordStrength }}</span>
              </div>
              <div class="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  :class="passwordStrengthBarClass"
                  :style="{ width: passwordStrengthPercent + '%' }"
                  class="h-full transition-all duration-300"
                />
              </div>
              <ul v-if="passwordErrors.length" class="mt-2 text-xs text-red-600 space-y-1">
                <li v-for="error in passwordErrors" :key="error">• {{ error }}</li>
              </ul>
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Confirm your password"
            >
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-xs text-red-600">
              Passwords do not match
            </p>
          </div>

          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              v-model="form.bio"
              name="bio"
              rows="3"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Tell us a bit about your crafting interests..."
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.agreeToTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <NuxtLink to="/terms" class="text-purple-600 hover:text-purple-500">Terms and Conditions</NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-purple-600 hover:text-purple-500">Privacy Policy</NuxtLink>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !canSubmit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'

const userStore = useUserStore()
const uiStore = useUIStore()
const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  bio: '',
  agreeToTerms: false
})

const loading = ref(false)
const error = ref('')
const passwordErrors = ref([])
const passwordStrength = ref('')
const passwordStrengthPercent = ref(0)

const canSubmit = computed(() => {
  return form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.password === form.value.confirmPassword &&
    form.value.agreeToTerms &&
    passwordErrors.value.length === 0
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrengthPercent.value
  if (strength < 25) return 'text-red-600'
  if (strength < 50) return 'text-orange-600'
  if (strength < 75) return 'text-yellow-600'
  return 'text-green-600'
})

const passwordStrengthBarClass = computed(() => {
  const strength = passwordStrengthPercent.value
  if (strength < 25) return 'bg-red-500'
  if (strength < 50) return 'bg-orange-500'
  if (strength < 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

const checkPasswordStrength = () => {
  const password = form.value.password
  const errors = []
  let strength = 0
  
  if (password.length >= 8) strength += 20
  else errors.push('At least 8 characters')
  
  if (/[A-Z]/.test(password)) strength += 20
  else errors.push('At least one uppercase letter')
  
  if (/[a-z]/.test(password)) strength += 20
  else errors.push('At least one lowercase letter')
  
  if (/[0-9]/.test(password)) strength += 20
  else errors.push('At least one number')
  
  if (/[!@#$%^&*]/.test(password)) strength += 20
  else errors.push('At least one special character (!@#$%^&*)')
  
  passwordErrors.value = errors
  passwordStrengthPercent.value = strength
  
  if (strength === 100) passwordStrength.value = 'Strong'
  else if (strength >= 60) passwordStrength.value = 'Good'
  else if (strength >= 40) passwordStrength.value = 'Fair'
  else passwordStrength.value = 'Weak'
}

const handleRegister = async () => {
  if (!canSubmit.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await userStore.register({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      bio: form.value.bio
    })
    
    uiStore.showSuccess('Account created successfully! Welcome to Needle & Kin!')
    await router.push('/')
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.data?.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Register - Needle & Kin',
  meta: [
    { name: 'description', content: 'Create your Needle & Kin account' }
  ]
})
</script>