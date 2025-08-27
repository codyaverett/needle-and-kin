<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading post...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
        <p class="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
        <NuxtLink to="/blog" class="text-purple-600 hover:text-purple-800 font-medium">
          ← Back to Blog
        </NuxtLink>
      </div>
    </div>
    
    <!-- Post Content -->
    <article v-else-if="post" class="bg-white">
      <!-- Hero Section -->
      <div class="relative h-96 bg-gradient-to-br from-purple-600 to-pink-600">
        <img 
          v-if="post.image"
          :src="post.image" 
          :alt="post.title"
          class="w-full h-full object-cover opacity-90 mix-blend-overlay"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="container mx-auto max-w-4xl">
            <!-- Category and Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <NuxtLink 
                v-if="post.category"
                :to="`/blog/category/${post.category}`"
                class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors"
              >
                {{ post.category }}
              </NuxtLink>
              <NuxtLink 
                v-for="tag in post.tags" 
                :key="tag"
                :to="`/blog/tag/${tag}`"
                class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
            
            <!-- Title -->
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">{{ post.title }}</h1>
            
            <!-- Meta Info -->
            <div class="flex items-center gap-6 text-white/90">
              <div class="flex items-center gap-2">
                <img 
                  :src="post.author?.avatar || '/avatars/placeholder.jpg'" 
                  :alt="post.author?.name"
                  class="w-8 h-8 rounded-full border-2 border-white/50"
                />
                <NuxtLink 
                  :to="`/blog/author/${post.author?.id}`"
                  class="hover:text-white"
                >
                  {{ post.author?.name }}
                </NuxtLink>
              </div>
              <span>•</span>
              <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
              <span>•</span>
              <span>{{ post.readTime || '5 min read' }}</span>
              <span v-if="post.views">•</span>
              <span v-if="post.views">{{ post.views }} views</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="container mx-auto max-w-4xl px-4 py-12">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Excerpt -->
            <div class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
              {{ post.excerpt }}
            </div>
            
            <!-- Article Content -->
            <div class="prose prose-lg max-w-none">
              <div v-html="post.content || generateMockContent()"></div>
            </div>
            
            <!-- Author Bio -->
            <div class="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">About the Author</h3>
              <div class="flex items-start gap-4">
                <img 
                  :src="post.author?.avatar || '/avatars/placeholder.jpg'" 
                  :alt="post.author?.name"
                  class="w-16 h-16 rounded-full"
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ post.author?.name }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ post.author?.bio }}</p>
                  <NuxtLink 
                    :to="`/blog/author/${post.author?.id}`"
                    class="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2 inline-block"
                  >
                    View all posts →
                  </NuxtLink>
                </div>
              </div>
            </div>
            
            <!-- Share Buttons -->
            <div class="mt-8 flex items-center gap-4">
              <span class="text-gray-600 font-medium">Share:</span>
              <button 
                @click="shareOnTwitter"
                class="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button 
                @click="shareOnFacebook"
                class="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                @click="copyLink"
                class="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                </svg>
              </button>
            </div>
            
            <!-- Comments Section -->
            <div class="mt-12 pt-8 border-t">
              <h3 class="text-2xl font-bold mb-6">Comments ({{ comments?.length || 0 }})</h3>
              
              <!-- Comment Form -->
              <div v-if="userStore.isAuthenticated" class="mb-8">
                <form @submit.prevent="submitComment" class="space-y-4">
                  <textarea
                    v-model="newComment"
                    rows="4"
                    placeholder="Share your thoughts..."
                    class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  ></textarea>
                  <button 
                    type="submit"
                    :disabled="!newComment || submittingComment"
                    class="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ submittingComment ? 'Posting...' : 'Post Comment' }}
                  </button>
                </form>
              </div>
              <div v-else class="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p class="text-gray-600 mb-4">Please log in to leave a comment</p>
                <button 
                  @click="uiStore.openModal('login')"
                  class="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Log In →
                </button>
              </div>
              
              <!-- Comments List -->
              <div v-if="comments?.length" class="space-y-6">
                <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
                  <img 
                    :src="comment.author?.avatar || '/avatars/placeholder.jpg'" 
                    :alt="comment.author?.name"
                    class="w-10 h-10 rounded-full"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium">{{ comment.author?.name }}</span>
                      <span class="text-gray-500 text-sm">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <p class="text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                Be the first to comment!
              </div>
            </div>
          </div>
          
          <!-- Sidebar -->
          <aside class="lg:col-span-1">
            <!-- Sticky Container -->
            <div class="sticky top-8 space-y-8">
              <!-- Table of Contents -->
              <div v-if="tableOfContents?.length" class="bg-gray-50 rounded-lg p-6">
                <h3 class="font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav>
                  <ul class="space-y-2">
                    <li v-for="item in tableOfContents" :key="item.id">
                      <a 
                        :href="`#${item.id}`"
                        class="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                      >
                        {{ item.text }}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              
              <!-- Related Posts -->
              <div v-if="relatedPosts?.length" class="bg-white border rounded-lg p-6">
                <h3 class="font-semibold text-gray-900 mb-4">Related Posts</h3>
                <div class="space-y-4">
                  <NuxtLink 
                    v-for="relatedPost in relatedPosts"
                    :key="relatedPost.id"
                    :to="`/blog/${relatedPost.slug}`"
                    class="block group"
                  >
                    <div class="flex gap-3">
                      <img 
                        :src="relatedPost.image || '/placeholder-blog.jpg'"
                        :alt="relatedPost.title"
                        class="w-20 h-20 object-cover rounded"
                      />
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {{ relatedPost.title }}
                        </h4>
                        <p class="text-sm text-gray-500 mt-1">{{ relatedPost.readTime }}</p>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
              
              <!-- Newsletter CTA -->
              <div class="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg p-6">
                <h3 class="font-semibold text-lg mb-2">Stay Updated</h3>
                <p class="text-sm opacity-90 mb-4">Get the latest crafting tutorials and tips delivered to your inbox.</p>
                <form @submit.prevent="subscribeNewsletter" class="space-y-3">
                  <input 
                    v-model="newsletterEmail"
                    type="email"
                    placeholder="Your email"
                    class="w-full px-3 py-2 rounded text-gray-900 text-sm"
                    required
                  />
                  <button 
                    type="submit"
                    class="w-full bg-white text-purple-600 px-4 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <!-- More Posts -->
      <div v-if="morePosts?.length" class="bg-gray-50 py-16">
        <div class="container mx-auto max-w-6xl px-4">
          <h2 class="text-3xl font-bold text-center mb-12">More from {{ post.author?.name }}</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <BlogCard v-for="morePost in morePosts" :key="morePost.id" :post="morePost" />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { useBlogStore } from '~/stores/blog'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'

const route = useRoute()
const blogStore = useBlogStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const newComment = ref('')
const submittingComment = ref(false)
const newsletterEmail = ref('')

// Fetch post data
const { data: post, pending, error } = await useFetch(`/api/posts/${route.params.slug}`)

// Fetch related data
const { data: relatedPosts } = await useFetch(`/api/posts/${route.params.slug}/related`)
const { data: comments } = await useFetch(`/api/posts/${route.params.slug}/comments`)
const { data: morePosts } = await useFetch('/api/posts', {
  query: {
    author: post.value?.author?.id,
    exclude: post.value?.id,
    limit: 3
  }
})

// Generate table of contents from content
const tableOfContents = computed(() => {
  if (!post.value?.content) return []
  
  // Parse headings from HTML content
  const regex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi
  const headings = []
  let match
  
  while ((match = regex.exec(post.value.content)) !== null) {
    headings.push({
      id: match[1].toLowerCase().replace(/\s+/g, '-'),
      text: match[1].replace(/<[^>]*>/g, '')
    })
  }
  
  return headings
})

// Helper functions
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const generateMockContent = () => {
  return `
    <h2 id="getting-started">Getting Started</h2>
    <p>Welcome to this comprehensive guide on ${post.value?.title}. In this tutorial, we'll explore the fundamental techniques and best practices that will help you master this craft.</p>
    
    <p>Before we dive into the details, let's gather our materials and prepare our workspace. Having everything organized from the start will make the process much more enjoyable and efficient.</p>
    
    <h3 id="materials-needed">Materials Needed</h3>
    <ul>
      <li>High-quality materials specific to your project</li>
      <li>Essential tools for precision work</li>
      <li>Safety equipment when necessary</li>
      <li>A clean, well-lit workspace</li>
      <li>Patience and creativity!</li>
    </ul>
    
    <h2 id="step-by-step-guide">Step-by-Step Guide</h2>
    <p>Now that we have everything ready, let's begin with the first step. Take your time with each stage - crafting is about the journey as much as the destination.</p>
    
    <h3 id="step-1">Step 1: Foundation</h3>
    <p>Every great project starts with a solid foundation. Begin by carefully preparing your base materials, ensuring they're clean and ready for work.</p>
    
    <blockquote>
      <p>"The secret to beautiful crafting is in the details. Take time to perfect each step before moving on to the next."</p>
    </blockquote>
    
    <h3 id="step-2">Step 2: Building</h3>
    <p>With your foundation ready, it's time to start building. Work methodically, checking your progress frequently to ensure accuracy.</p>
    
    <p>Remember that mistakes are part of the learning process. If something doesn't look quite right, don't hesitate to undo and try again. Each attempt teaches you something valuable.</p>
    
    <h2 id="tips-and-tricks">Tips and Tricks</h2>
    <p>Here are some professional tips I've learned over the years:</p>
    
    <ul>
      <li><strong>Work in good lighting:</strong> Natural light is best, but a good craft lamp is essential for evening work.</li>
      <li><strong>Take regular breaks:</strong> Step back every 30 minutes to rest your eyes and assess your progress.</li>
      <li><strong>Keep notes:</strong> Document what works and what doesn't for future reference.</li>
      <li><strong>Join a community:</strong> Share your work and learn from others in the crafting community.</li>
    </ul>
    
    <h2 id="common-mistakes">Common Mistakes to Avoid</h2>
    <p>Even experienced crafters make mistakes. Here are the most common ones to watch out for:</p>
    
    <ol>
      <li>Rushing through the preparation stage</li>
      <li>Using low-quality materials to save money</li>
      <li>Not reading instructions thoroughly before starting</li>
      <li>Ignoring proper technique in favor of shortcuts</li>
      <li>Not maintaining your tools properly</li>
    </ol>
    
    <h2 id="finishing-touches">Finishing Touches</h2>
    <p>The final stage is where your project truly comes to life. Take extra care with these finishing touches - they're what separate good work from exceptional work.</p>
    
    <p>Once complete, step back and admire your creation. You've not only made something beautiful but also developed skills that will serve you in future projects.</p>
    
    <h2 id="conclusion">Conclusion</h2>
    <p>Congratulations on completing this tutorial! Remember that mastery comes with practice, so don't be discouraged if your first attempt isn't perfect. Each project is an opportunity to learn and grow.</p>
    
    <p>I'd love to see what you create! Share your finished projects in the comments below or tag us on social media. Happy crafting!</p>
  `
}

// Actions
const submitComment = async () => {
  if (!newComment.value || submittingComment.value) return
  
  submittingComment.value = true
  
  try {
    await blogStore.postComment(post.value.id, {
      content: newComment.value
    })
    
    newComment.value = ''
    uiStore.showSuccess('Comment posted successfully!')
    
    // Refresh comments
    await refreshNuxtData()
  } catch (error) {
    uiStore.showError('Failed to post comment. Please try again.')
  } finally {
    submittingComment.value = false
  }
}

const shareOnTwitter = () => {
  const url = window.location.href
  const text = `Check out "${post.value.title}" on Needle & Kin`
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
}

const shareOnFacebook = () => {
  const url = window.location.href
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    uiStore.showSuccess('Link copied to clipboard!')
  } catch (error) {
    uiStore.showError('Failed to copy link')
  }
}

const subscribeNewsletter = async () => {
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email: newsletterEmail.value }
    })
    
    newsletterEmail.value = ''
    uiStore.showSuccess('Successfully subscribed to newsletter!')
  } catch (error) {
    uiStore.showError('Failed to subscribe. Please try again.')
  }
}

// Track view
onMounted(() => {
  if (post.value?.id) {
    blogStore.incrementViews(post.value.id)
    
    if (userStore.isAuthenticated) {
      userStore.addToReadingHistory(post.value.id)
    }
  }
})

// SEO
useHead({
  title: post.value?.title || 'Blog Post',
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value?.title || '' },
    { property: 'og:description', content: post.value?.excerpt || '' },
    { property: 'og:image', content: post.value?.image || '' },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value?.title || '' },
    { name: 'twitter:description', content: post.value?.excerpt || '' },
    { name: 'twitter:image', content: post.value?.image || '' },
  ]
})
</script>

<style scoped>
.prose {
  @apply text-gray-700;
}

.prose h2 {
  @apply text-2xl font-bold mt-8 mb-4 text-gray-900;
}

.prose h3 {
  @apply text-xl font-semibold mt-6 mb-3 text-gray-900;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul, .prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-purple-500 pl-4 py-2 my-6 italic text-gray-600;
}

.prose strong {
  @apply font-semibold text-gray-900;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>