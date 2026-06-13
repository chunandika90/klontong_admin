<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <NuxtLink :to="`/products/${id}`" class="text-sm text-indigo-600 hover:underline">← Kembali ke Detail</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Edit Produk</h1>
    </div>

    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 rounded" />
      </div>
    </div>

    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 text-sm">{{ fetchError }}</p>
    </div>

    <ProductForm
      v-else-if="product"
      :initial="product"
      :loading="saving"
      :error="saveError"
      @submit="handleSubmit"
    />

    <div v-else class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center text-yellow-700 text-sm space-y-3">
      <p>Produk belum dimuat.</p>
      <button @click="loadProduct" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Muat Data</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const authStore = useAuthStore()
const route = useRoute()
const id = Number(route.params.id)

const product = ref<Product | null>(null)
const loading = ref(true)
const fetchError = ref('')
const saving = ref(false)
const saveError = ref('')

async function loadProduct() {
  loading.value = true
  fetchError.value = ''
  try {
    const token = authStore.token
    product.value = await $fetch<Product>(`/products/${id}`, {
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch (e: any) {
    fetchError.value = e?.data?.message || e?.message || 'Gagal memuat produk'
  } finally {
    loading.value = false
  }
}

onMounted(loadProduct)

async function handleSubmit(data: Partial<Product>) {
  saving.value = true
  saveError.value = ''
  try {
    const token = authStore.token
    const { id: _id, categoryName, createdAt, updatedAt, ...payload } = data as any
    await $fetch(`/products/${id}`, {
      method: 'PATCH',
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: payload,
    })
    navigateTo(`/products/${id}`)
  } catch (e: any) {
    const msg = e?.data?.message
    saveError.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal menyimpan perubahan'
  } finally {
    saving.value = false
  }
}
</script>
