<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Buat Akun</h1>
        <p class="text-gray-500 mt-1 text-sm">Daftar sebagai staf toko</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input v-model="form.name" type="text" placeholder="Nama kamu" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" placeholder="email@contoh.com" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" placeholder="Min. 6 karakter" required minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{{ error }}</div>

        <button type="submit" :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm">
          {{ loading ? 'Memproses...' : 'Daftar' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?
        <NuxtLink to="/auth/login" class="text-indigo-600 hover:underline font-medium">Masuk</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const config = useRuntimeConfig()
const form = reactive({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{ accessToken: string; user: any }>('/auth/register', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: { name: form.name, email: form.email, password: form.password },
    })
    authStore.setAuth(res.accessToken, res.user)
    navigateTo('/')
  } catch (e: any) {
    const msg = e?.data?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal mendaftar'
  } finally {
    loading.value = false
  }
}
</script>
