
import fs from 'fs'
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  
  router: {
    options: './router.options.ts'
  },

  devtools: { enabled: true },

  // server :  {
  //   host: '0.0.0.0',
  //   https: {
  //     key: fs.readFileSync('../Cert/star_agrambanka.hr.pem'),
  //     cert: fs.readFileSync('../Cert/star_agrambanka_hr.crt')
  //   }
  // },

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
    // autoImports: [
    //   ...['defineStore'],
    //   ['defineStore', 'acceptHMRUpdate'],
    // ] as string[],
  },

  plugins: [
    '~/plugins/fontawesome.js',
  ],

  compatibilityDate: '2024-07-09',
})
