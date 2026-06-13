<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <NuxtLink to="/products" class="text-sm text-indigo-600 hover:underline">← Kembali ke Produk</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Tambah Produk</h1>
    </div>

    <ProductForm
      :loading="loading"
      :error="error"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

async function handleSubmit(data: Partial<Product>) {
  loading.value = true
  error.value = ''
  try {
    const token = authStore.token
    const product = await $fetch<Product>('/products', {
      method: 'POST',
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data,
    })
    navigateTo(`/products/${product.id}`)
  } catch (e: any) {
    const msg = e?.data?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal menyimpan produk'
  } finally {
    loading.value = false
  }
}
</script>
