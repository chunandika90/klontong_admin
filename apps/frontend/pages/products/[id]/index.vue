<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/products" class="text-sm text-indigo-600 hover:underline">← Kembali ke Produk</NuxtLink>
    </div>

    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div class="h-4 bg-gray-100 rounded w-1/2" />
    </div>

    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p class="text-red-600">{{ fetchError }}</p>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Image + actions -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <img
            :src="product.image || 'https://placehold.co/300x300/e5e7eb/9ca3af?text=?'"
            :alt="product.name"
            class="w-full aspect-square object-cover rounded-lg bg-gray-100"
            @error="($event.target as HTMLImageElement).src = 'https://placehold.co/300x300/e5e7eb/9ca3af?text=?'"
          />
          <div class="flex flex-col gap-2">
            <button @click="openEditModal"
              class="w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Edit Produk
            </button>
            <button @click="handleArchive"
              class="w-full text-center border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
              Arsipkan
            </button>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
              <p class="text-gray-500 text-sm mt-1">SKU: <span class="font-mono">{{ product.sku }}</span></p>
            </div>
            <span :class="product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              class="text-sm px-3 py-1 rounded-full font-medium">
              {{ product.isActive ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
          <p v-if="product.description" class="text-gray-600 mt-4 text-sm">{{ product.description }}</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="font-semibold text-gray-900 mb-4">Informasi Harga & Stok</h2>
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-xs text-gray-500 uppercase tracking-wide">Harga</dt>
              <dd class="text-xl font-bold text-indigo-600 mt-1">{{ formatPrice(product.price) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500 uppercase tracking-wide">Stok</dt>
              <dd class="text-xl font-bold mt-1" :class="product.stock < 10 ? 'text-red-600' : 'text-gray-900'">
                {{ product.stock }} unit
              </dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="font-semibold text-gray-900 mb-4">Detail Produk</h2>
          <dl class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt class="text-gray-500">Kategori</dt>
              <dd class="font-medium text-gray-900 mt-0.5">{{ product.categoryName }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Berat</dt>
              <dd class="font-medium text-gray-900 mt-0.5">{{ product.weight }}g</dd>
            </div>
            <div>
              <dt class="text-gray-500">Dimensi (P×L×T)</dt>
              <dd class="font-medium text-gray-900 mt-0.5">{{ product.length }}×{{ product.width }}×{{ product.height }}cm</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">Edit Produk</h2>
          <button @click="modalOpen = false" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div v-if="modalLoading" class="p-6 space-y-3 animate-pulse">
          <div v-for="i in 6" :key="i" class="h-10 bg-gray-100 rounded" />
        </div>

        <div v-else class="p-6 space-y-4">
          <div v-if="modalError" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {{ modalError }}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">SKU <span class="text-red-500">*</span></label>
              <input v-model="form.sku" type="text" maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori <span class="text-red-500">*</span></label>
              <select v-model.number="form.categoryId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Pilih kategori</option>
                <option v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input v-model.number="form.price" type="number" min="0"
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stok <span class="text-red-500">*</span></label>
              <input v-model.number="form.stock" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat (gram) <span class="text-red-500">*</span></label>
              <input v-model.number="form.weight" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Panjang (cm)</label>
              <input v-model.number="form.length" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lebar (cm)</label>
              <input v-model.number="form.width" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi (cm)</label>
              <input v-model.number="form.height" type="number" min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
              <input v-model="form.image" type="text" placeholder="https://..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea v-model="form.description" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <div class="flex items-center gap-2">
            <input v-model="form.isActive" type="checkbox" id="isActiveModal"
              class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            <label for="isActiveModal" class="text-sm font-medium text-gray-700 cursor-pointer">Produk Aktif</label>
          </div>

          <div class="flex gap-3 pt-2 border-t border-gray-100">
            <button @click="modalOpen = false"
              class="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button @click="submitEdit" :disabled="modalSaving"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {{ modalSaving ? 'Menyimpan...' : 'Simpan Produk' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const authStore = useAuthStore()
const categoriesStore = useCategoriesStore()
const route = useRoute()
const id = Number(route.params.id)

const product = ref<Product | null>(null)
const loading = ref(true)
const fetchError = ref('')

const modalOpen = ref(false)
const modalLoading = ref(false)
const modalSaving = ref(false)
const modalError = ref('')
const form = reactive<Partial<Product>>({
  name: '', sku: '', categoryId: undefined,
  price: 0, stock: 0, weight: 0,
  width: 0, length: 0, height: 0,
  image: '', description: '', isActive: true,
})

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

async function handleArchive() {
  if (!confirm('Arsipkan produk ini?')) return
  const token = authStore.token
  await $fetch(`/products/${id}`, {
    method: 'DELETE',
    baseURL: config.public.apiBase as string,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  navigateTo('/products')
}

async function openEditModal() {
  modalError.value = ''
  modalOpen.value = true
  modalLoading.value = true
  try {
    const token = authStore.token
    const data = await $fetch<Product>(`/products/${id}`, {
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    Object.assign(form, data)
  } catch (e: any) {
    modalError.value = e?.data?.message || 'Gagal memuat data produk'
  } finally {
    modalLoading.value = false
  }
}

async function submitEdit() {
  modalSaving.value = true
  modalError.value = ''
  try {
    const token = authStore.token
    const { id: _id, categoryName, createdAt, updatedAt, ...payload } = form as any
    await $fetch(`/products/${id}`, {
      method: 'PATCH',
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: payload,
    })
    modalOpen.value = false
    // Reload product detail
    const updated = await $fetch<Product>(`/products/${id}`, {
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    product.value = updated
  } catch (e: any) {
    const msg = e?.data?.message
    modalError.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal menyimpan perubahan'
  } finally {
    modalSaving.value = false
  }
}

onMounted(async () => {
  try {
    const token = authStore.token
    product.value = await $fetch<Product>(`/products/${id}`, {
      baseURL: config.public.apiBase as string,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    await categoriesStore.fetchCategories()
  } catch (e: any) {
    fetchError.value = e?.data?.message || 'Produk tidak ditemukan'
  } finally {
    loading.value = false
  }
})
</script>
