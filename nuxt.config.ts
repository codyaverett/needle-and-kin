// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-28',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  alias: {
    '@components': fileURLToPath(new URL('./components', import.meta.url)),
    '@pages': fileURLToPath(new URL('./pages', import.meta.url)),
    '@layouts': fileURLToPath(new URL('./layouts', import.meta.url)),
    '@stores': fileURLToPath(new URL('./stores', import.meta.url)),
    '@server': fileURLToPath(new URL('./server', import.meta.url)),
    '@utils': fileURLToPath(new URL('./utils', import.meta.url)),
    '@types': fileURLToPath(new URL('./server/types', import.meta.url)),
    '@api': fileURLToPath(new URL('./server/api', import.meta.url)),
    '@middleware': fileURLToPath(new URL('./middleware', import.meta.url)),
    '@plugins': fileURLToPath(new URL('./plugins', import.meta.url)),
    '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    '@public': fileURLToPath(new URL('./public', import.meta.url))
  },
  vite: {
    server: {
      allowedHosts: ['*.ngrok-free.app', '4011de57d201.ngrok-free.app'],
      hmr: {
        clientPort: 443
      }
    }
  },
  ignore: [
    '**/*.test.ts',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.spec.js',
    '**/test-utils.ts',
    'test/**/*'
  ],
  app: {
    head: {
      title: 'Needle & Kin - Crafting Community',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A blog about crafting, creativity, and connection through handmade art.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  }
})