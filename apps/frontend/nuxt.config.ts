export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  runtimeConfig: {
    apiBaseServer: process.env.NUXT_API_BASE_SERVER || process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },
  app: {
    head: {
      title: 'Klontong Admin',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  typescript: { strict: false },
})
