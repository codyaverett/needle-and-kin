<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'Needle & Kin - Blog',
  meta: [
    { name: 'description', content: 'A blog about crafting, creativity, and connection' }
  ]
})
</script>

<style>
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>