export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  devtools: { enabled: true },

  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  build: {
    transpile: ['@fortawesome/vue-fontawesome'],
  },

  modules: [
    '@pinia/nuxt',
  ],

  vite: {
    vue: {
      // Vite konfiguracija za Vue
    },
  },

  pinia: {
    autoImports: [
      ...['defineStore'],
      ['defineStore', 'acceptHMRUpdate'],
    ] as string[],
  },

  plugins: [
    '~/plugins/fontawesome.js',
  ],

  compatibilityDate: '2024-07-09',
})
