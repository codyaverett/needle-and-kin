<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-gray-900">Needle & Kin</span>
        </NuxtLink>
        
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="text-gray-700 hover:text-gray-900 transition-colors">
            Home
          </NuxtLink>
          <NuxtLink to="/blog" class="text-gray-700 hover:text-gray-900 transition-colors">
            Blog
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900 transition-colors">
            About
          </NuxtLink>
          <NuxtLink to="/contact" class="text-gray-700 hover:text-gray-900 transition-colors">
            Contact
          </NuxtLink>
          
          <!-- Auth Section -->
          <div v-if="userStore.isAuthenticated" class="relative">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <img
                :src="userStore.userAvatar"
                :alt="userStore.username"
                class="h-8 w-8 rounded-full"
              >
              <span>{{ userStore.username }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- User Dropdown Menu -->
            <div
              v-show="userMenuOpen"
              @click.away="userMenuOpen = false"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <NuxtLink
                  to="/profile"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </NuxtLink>
                
                <NuxtLink
                  v-if="userStore.currentUser?.role === 'admin'"
                  to="/admin"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </span>
                </NuxtLink>
                
                <hr class="my-1" />
                
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <NuxtLink to="/login" class="text-gray-700 hover:text-gray-900 transition-colors">
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Sign Up
            </NuxtLink>
          </div>
        </div>

        <button @click="toggleMobileMenu" class="md:hidden p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-4">
          <NuxtLink to="/" class="text-gray-700 hover:text-gray-900 transition-colors">
            Home
          </NuxtLink>
          <NuxtLink to="/blog" class="text-gray-700 hover:text-gray-900 transition-colors">
            Blog
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900 transition-colors">
            About
          </NuxtLink>
          <NuxtLink to="/contact" class="text-gray-700 hover:text-gray-900 transition-colors">
            Contact
          </NuxtLink>
          
          <hr />
          
          <div v-if="userStore.isAuthenticated">
            <NuxtLink to="/profile" class="block text-gray-700 hover:text-gray-900 transition-colors mb-2">
              My Profile
            </NuxtLink>
            <NuxtLink
              v-if="userStore.currentUser?.role === 'admin'"
              to="/admin"
              class="block text-purple-600 hover:text-purple-700 transition-colors mb-2"
            >
              Admin Panel
            </NuxtLink>
            <button
              @click="handleLogout"
              class="text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
          <div v-else>
            <NuxtLink to="/login" class="block text-gray-700 hover:text-gray-900 transition-colors mb-2">
              Sign In
            </NuxtLink>
            <NuxtLink to="/register" class="block text-purple-600 hover:text-purple-700 transition-colors">
              Sign Up
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleLogout = async () => {
  await userStore.logout()
  mobileMenuOpen.value = false
  userMenuOpen.value = false
}
</script>