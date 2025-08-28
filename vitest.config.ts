import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts', './test/server-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'coverage/',
        '*.config.ts',
        '*.config.js',
        'test/',
        '.storybook/',
        'scripts/'
      ]
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache', '.nuxt'],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@pages': resolve(__dirname, './pages'),
      '@layouts': resolve(__dirname, './layouts'),
      '@stores': resolve(__dirname, './stores'),
      '@server': resolve(__dirname, './server'),
      '@utils': resolve(__dirname, './utils'),
      '@types': resolve(__dirname, './server/types'),
      '@api': resolve(__dirname, './server/api'),
      '@middleware': resolve(__dirname, './middleware'),
      '@plugins': resolve(__dirname, './plugins'),
      '@assets': resolve(__dirname, './assets'),
      '@public': resolve(__dirname, './public')
    }
  }
})