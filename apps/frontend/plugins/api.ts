import { initApi } from '~/services/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  initApi(config.public.apiBase as string, () => authStore.token)
})
