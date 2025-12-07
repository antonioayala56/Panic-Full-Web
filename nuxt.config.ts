// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: 'iPanic Reader Web - Analizador de Panic Logs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Analizador profesional de Panic Logs para iPhone XS hasta 16 Pro Max' }
      ],
      link: [
        { rel: 'icon', href: '/icon-pro.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/theme-future.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  vite: {
    server: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '*.ngrok-free.app',
        '*.ngrok-free.dev',
        '*.ngrok.io'
      ]
    }
  },

  nitro: {
    experimental: {
      wasm: true
    }
  },

  compatibilityDate: '2024-11-07',

  devtools: { enabled: true }
})
