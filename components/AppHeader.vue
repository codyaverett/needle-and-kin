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
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>