<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Klontong Admin</h1>
        <p class="text-gray-500 mt-1 text-sm">Masuk ke dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@klontong.com"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="text-indigo-600 hover:underline font-medium">Daftar</NuxtLink>
      </p>

      <div class="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
        <p class="font-medium mb-1">Test accounts:</p>
        <p>admin@klontong.com / admin123</p>
        <p>staff@klontong.com / staff123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from '~/services/auth.service'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

onMounted(() => {
  authStore.loadFromStorage()
  if (authStore.isAuthenticated) navigateTo('/')
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const config = useRuntimeConfig()
    const res = await $fetch<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: { email: form.email, password: form.password },
    })
    authStore.setAuth(res.accessToken, res.user)
    navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.message || 'Email atau password salah'
  } finally {
    loading.value = false
  }
}
</script>
