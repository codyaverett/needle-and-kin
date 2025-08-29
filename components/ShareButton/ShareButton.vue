<template>
  <div class="relative">
    <button
      @click="toggleMenu"
      :class="[
        'flex items-center space-x-2 transition-colors',
        variant === 'button' 
          ? 'px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700'
          : variant === 'outline'
          ? 'px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
          : 'text-gray-500 hover:text-gray-700'
      ]"
    >
      <Icon name="mdi:share-variant" :class="iconSize" />
      <span v-if="showLabel" class="text-sm font-medium">{{ label }}</span>
    </button>

    <Transition name="share-menu">
      <div
        v-if="isOpen"
        v-click-outside="closeMenu"
        :class="[
          'absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-56',
          menuPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          menuAlign === 'right' ? 'right-0' : 'left-0'
        ]"
      >
        <div class="px-3 pb-2 border-b border-gray-200">
          <p class="text-sm font-medium text-gray-900">Share via</p>
        </div>

        <button
          v-for="platform in platforms"
          :key="platform.name"
          @click="share(platform.name)"
          class="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
        >
          <Icon :name="platform.icon" :class="['h-5 w-5', platform.color]" />
          <span>{{ platform.label }}</span>
        </button>

        <div class="border-t border-gray-200 mt-2 pt-2">
          <button
            @click="copyLink"
            class="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <Icon name="mdi:link" class="h-5 w-5 text-gray-500" />
            <span>{{ linkCopied ? 'Link copied!' : 'Copy link' }}</span>
          </button>
        </div>

        <div v-if="showEmbedOption" class="border-t border-gray-200 pt-2">
          <button
            @click="showEmbedCode"
            class="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <Icon name="mdi:code-tags" class="h-5 w-5 text-gray-500" />
            <span>Embed</span>
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="embed-modal">
      <div
        v-if="showEmbed"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showEmbed = false"
      >
        <div class="bg-white rounded-lg max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Embed Code</h3>
          <div class="bg-gray-100 rounded-md p-3">
            <code class="text-sm text-gray-800 break-all">{{ embedCode }}</code>
          </div>
          <div class="flex justify-end space-x-3 mt-4">
            <button
              @click="showEmbed = false"
              class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Close
            </button>
            <button
              @click="copyEmbedCode"
              class="px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              {{ embedCopied ? 'Copied!' : 'Copy Code' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { vOnClickOutside as vClickOutside } from '@vueuse/components'

interface SharePlatform {
  name: string
  label: string
  icon: string
  color: string
  urlBuilder: (options: ShareOptions) => string
}

interface ShareOptions {
  url: string
  title?: string
  description?: string
  hashtags?: string[]
  image?: string
}

const props = withDefaults(defineProps<{
  url: string
  title?: string
  description?: string
  hashtags?: string[]
  image?: string
  variant?: 'icon' | 'button' | 'outline'
  showLabel?: boolean
  label?: string
  iconSize?: string
  menuPosition?: 'top' | 'bottom'
  menuAlign?: 'left' | 'right'
  showEmbedOption?: boolean
  customPlatforms?: string[]
}>(), {
  variant: 'icon',
  showLabel: true,
  label: 'Share',
  iconSize: 'h-5 w-5',
  menuPosition: 'bottom',
  menuAlign: 'left',
  showEmbedOption: false
})

const emit = defineEmits<{
  share: [platform: string, url: string]
  copy: []
  embed: []
}>()

const isOpen = ref(false)
const linkCopied = ref(false)
const showEmbed = ref(false)
const embedCopied = ref(false)

const allPlatforms: SharePlatform[] = [
  {
    name: 'facebook',
    label: 'Facebook',
    icon: 'mdi:facebook',
    color: 'text-blue-600',
    urlBuilder: (opts) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(opts.url)}`
  },
  {
    name: 'twitter',
    label: 'Twitter',
    icon: 'mdi:twitter',
    color: 'text-sky-500',
    urlBuilder: (opts) => {
      const params = new URLSearchParams()
      params.append('url', opts.url)
      if (opts.title) params.append('text', opts.title)
      if (opts.hashtags?.length) params.append('hashtags', opts.hashtags.join(','))
      return `https://twitter.com/intent/tweet?${params.toString()}`
    }
  },
  {
    name: 'pinterest',
    label: 'Pinterest',
    icon: 'mdi:pinterest',
    color: 'text-red-600',
    urlBuilder: (opts) => {
      const params = new URLSearchParams()
      params.append('url', opts.url)
      if (opts.description) params.append('description', opts.description)
      if (opts.image) params.append('media', opts.image)
      return `https://pinterest.com/pin/create/button/?${params.toString()}`
    }
  },
  {
    name: 'whatsapp',
    label: 'WhatsApp',
    icon: 'mdi:whatsapp',
    color: 'text-green-600',
    urlBuilder: (opts) => {
      const text = opts.title ? `${opts.title} - ${opts.url}` : opts.url
      return `https://wa.me/?text=${encodeURIComponent(text)}`
    }
  },
  {
    name: 'email',
    label: 'Email',
    icon: 'mdi:email',
    color: 'text-gray-600',
    urlBuilder: (opts) => {
      const subject = opts.title || 'Check this out'
      const body = opts.description ? `${opts.description}\n\n${opts.url}` : opts.url
      return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }
]

const platforms = computed(() => {
  if (props.customPlatforms?.length) {
    return allPlatforms.filter(p => props.customPlatforms.includes(p.name))
  }
  return allPlatforms
})

const embedCode = computed(() => {
  return `<iframe src="${props.url}" width="600" height="400" frameborder="0"></iframe>`
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const share = (platformName: string) => {
  const platform = platforms.value.find(p => p.name === platformName)
  if (!platform) return

  const shareUrl = platform.urlBuilder({
    url: props.url,
    title: props.title,
    description: props.description,
    hashtags: props.hashtags,
    image: props.image
  })

  window.open(shareUrl, '_blank', 'width=600,height=400')
  emit('share', platformName, shareUrl)
  closeMenu()
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    linkCopied.value = true
    emit('copy')
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const showEmbedCode = () => {
  showEmbed.value = true
  closeMenu()
  emit('embed')
}

const copyEmbedCode = async () => {
  try {
    await navigator.clipboard.writeText(embedCode.value)
    embedCopied.value = true
    setTimeout(() => {
      embedCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy embed code:', error)
  }
}
</script>

<style scoped>
.share-menu-enter-active,
.share-menu-leave-active {
  transition: all 0.2s ease;
}

.share-menu-enter-from,
.share-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.embed-modal-enter-active,
.embed-modal-leave-active {
  transition: all 0.3s ease;
}

.embed-modal-enter-from,
.embed-modal-leave-to {
  opacity: 0;
}
</style>