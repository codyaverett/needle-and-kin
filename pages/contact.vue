<template>
  <div>
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-6">{{ contactInfo?.hero.title }}</h1>
        <p class="text-xl max-w-2xl mx-auto">
          {{ contactInfo?.hero.description }}
        </p>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12">
            <div>
              <h2 class="text-3xl font-bold mb-8">{{ contactInfo?.form.title }}</h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    v-model="form.subject"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option v-for="subject in contactInfo?.form.subjects" :key="subject.value" :value="subject.value">
                      {{ subject.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    required
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div class="flex items-start space-x-3">
                  <input
                    id="newsletter"
                    v-model="form.newsletter"
                    type="checkbox"
                    class="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label for="newsletter" class="text-sm text-gray-700">
                    I'd like to receive updates about new tutorials and blog posts via email.
                  </label>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isSubmitting" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                  <span v-else>Send Message</span>
                </button>
              </form>

              <div v-if="submitStatus === 'success'" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p class="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              </div>

              <div v-if="submitStatus === 'error'" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p class="text-red-800">Sorry, there was an error sending your message. Please try again later.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-3xl font-bold mb-8">{{ contactInfo?.contactMethods.title }}</h2>
              
              <div class="space-y-8">
                <div v-for="method in contactInfo?.contactMethods.methods" :key="method.title" class="flex items-start space-x-4">
                  <div class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg v-if="method.icon === 'email'" class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <svg v-else-if="method.icon === 'instagram'" class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297z"/>
                    </svg>
                    <svg v-else-if="method.icon === 'pinterest'" class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.372 0 12s5.374 12 12 12 12-5.372 12-12S18.626 0 12 0zm1.568 15.482c-.7 0-1.36-.382-1.568-.817l-.438 1.737c-.156.631-.58 1.265-.98 1.738-.3.35-.738.61-1.188.61-.688 0-1.25-.562-1.25-1.25 0-.344.14-.656.366-.883.188-.188.437-.29.7-.29.219 0 .425.07.594.195l.719-2.844c-.813-.25-1.375-1-1.375-1.875 0-1.094.875-1.969 1.969-1.969s1.969.875 1.969 1.969c0 .344-.094.656-.25.938l1.063.406c.719-.719 1.156-1.719 1.156-2.813 0-2.188-1.781-3.969-3.969-3.969S8.031 9.812 8.031 12s1.781 3.969 3.969 3.969c.875 0 1.688-.281 2.344-.781z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold mb-2">{{ method.title }}</h3>
                    <p class="text-gray-600 mb-2">{{ method.description }}</p>
                    <a :href="method.url" class="text-purple-600 hover:text-purple-800 font-medium">
                      {{ method.contact }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 class="text-xl font-semibold mb-4">{{ contactInfo?.faq.title }}</h3>
                <div class="space-y-4">
                  <div v-for="item in contactInfo?.faq.questions" :key="item.question">
                    <h4 class="font-medium text-gray-900">{{ item.question }}</h4>
                    <p class="text-gray-600">{{ item.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: contactInfo } = await useFetch('/api/contact-info')

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
})

const isSubmitting = ref(false)
const submitStatus = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  submitStatus.value = ''

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })

    submitStatus.value = 'success'
    
    // Reset form on success
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false
    }
  } catch (error) {
    console.error('Contact form error:', error)
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Contact Us - Needle & Kin',
  meta: [
    { name: 'description', content: 'Get in touch with the Needle & Kin team. We love hearing from our crafting community!' }
  ]
})
</script>