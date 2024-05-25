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
    transpile: [],
  },
  modules: [
    'nuxt-primevue',
    '@pinia/nuxt',
  ],
  primevue: {
    // PrimeVue konfiguracija
  },
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
})
