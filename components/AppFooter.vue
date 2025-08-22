<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Needle & Kin</h3>
          <p class="text-gray-300">
            A blog dedicated to crafting, creativity, and the connections we make through handmade art.
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-gray-300">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-white transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Follow Us</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Instagram</span>
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Pinterest</span>
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.372 0 12s5.374 12 12 12 12-5.372 12-12S18.626 0 12 0zm1.568 15.482c-.7 0-1.36-.382-1.568-.817l-.438 1.737c-.156.631-.58 1.265-.98 1.738-.3.35-.738.61-1.188.61-.688 0-1.25-.562-1.25-1.25 0-.344.14-.656.366-.883.188-.188.437-.29.7-.29.219 0 .425.07.594.195l.719-2.844c-.813-.25-1.375-1-1.375-1.875 0-1.094.875-1.969 1.969-1.969s1.969.875 1.969 1.969c0 .344-.094.656-.25.938l1.063.406c.719-.719 1.156-1.719 1.156-2.813 0-2.188-1.781-3.969-3.969-3.969S8.031 9.812 8.031 12s1.781 3.969 3.969 3.969c.875 0 1.688-.281 2.344-.781z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
        <p>&copy; {{ new Date().getFullYear() }} Needle & Kin. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>