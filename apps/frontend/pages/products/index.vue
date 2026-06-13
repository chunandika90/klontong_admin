<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Produk</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ store.total }} produk ditemukan</p>
      </div>
      <button @click="openCreate"
        class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
        + Tambah Produk
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Cari nama atau SKU..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select v-model="categoryFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option :value="null">Semua Kategori</option>
          <option v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <select v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option :value="null">Semua Status</option>
          <option :value="true">Aktif</option>
          <option :value="false">Nonaktif</option>
        </select>
        <select v-model="sortField"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="createdAt">Terbaru</option>
          <option value="name">Nama</option>
          <option value="price">Harga</option>
          <option value="stock">Stok</option>
        </select>
        <button @click="toggleSort"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          {{ store.query.sortOrder === 'ASC' ? '↑ ASC' : '↓ DESC' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl border border-gray-200 h-20 animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error"
      class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 font-medium">{{ store.error }}</p>
      <button @click="store.fetchProducts()" class="mt-3 text-sm text-red-500 hover:underline">Coba lagi</button>
    </div>

    <!-- Empty -->
    <div v-else-if="store.items.length === 0"
      class="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <p class="text-gray-400 text-lg">Tidak ada produk ditemukan</p>
      <p v-if="store.query.search" class="text-gray-400 text-sm mt-1">Coba ubah kata kunci pencarian</p>
      <button @click="openCreate" class="mt-4 inline-block text-indigo-600 text-sm hover:underline">
        Tambah produk pertama
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Produk</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">SKU</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Kategori</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600">Harga</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Stok</th>
              <th class="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in store.items" :key="product.id"
              class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.image || '/placeholder.png'"
                    :alt="product.name"
                    class="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    @error="($event.target as HTMLImageElement).src = 'https://placehold.co/40x40/e5e7eb/9ca3af?text=?'"
                  />
                  <div>
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-400 md:hidden">{{ product.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 hidden md:table-cell font-mono text-xs">{{ product.sku }}</td>
              <td class="px-4 py-3 text-gray-500 hidden lg:table-cell">{{ product.categoryName }}</td>
              <td class="px-4 py-3 text-right font-medium text-gray-900">{{ formatPrice(product.price) }}</td>
              <td class="px-4 py-3 text-right hidden sm:table-cell">
                <span :class="product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-700'">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="product.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'"
                  class="text-xs px-2 py-0.5 rounded-full font-medium">
                  {{ product.isActive ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/products/${product.id}`"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Detail</NuxtLink>
                  <button @click="openEdit(product)"
                    class="text-xs text-gray-600 hover:text-gray-800 font-medium">Edit</button>
                  <button @click="confirmArchive(product)"
                    class="text-xs text-red-500 hover:text-red-700 font-medium">Arsip</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Halaman {{ store.query.page }} dari {{ store.totalPages }}
        </p>
        <div class="flex gap-2">
          <button
            @click="store.setPage((store.query.page || 1) - 1)"
            :disabled="store.query.page === 1"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
            ← Prev
          </button>
          <button
            @click="store.setPage((store.query.page || 1) + 1)"
            :disabled="store.query.page === store.totalPages"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Archive confirm modal -->
    <div v-if="archiveTarget" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h3 class="font-bold text-gray-900 mb-2">Arsipkan Produk?</h3>
        <p class="text-sm text-gray-600 mb-4">
          Produk <strong>{{ archiveTarget.name }}</strong> akan diarsipkan dan tidak muncul di list aktif.
        </p>
        <div class="flex gap-3">
          <button @click="archiveTarget = null"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Batal</button>
          <button @click="doArchive"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Arsipkan</button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">{{ editTarget ? 'Edit Produk' : 'Tambah Produk' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <!-- Loading state (edit: fetching data) -->
        <div v-if="modalLoading" class="p-6 space-y-3 animate-pulse">
          <div v-for="i in 6" :key="i" class="h-10 bg-gray-100 rounded" />
        </div>

        <!-- Form -->
        <div v-else class="p-6 space-y-4">
          <div v-if="modalError" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {{ modalError }}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">SKU <span class="text-red-500">*</span></label>
              <input v-model="form.sku" type="text" required maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
              <p class="text-xs text-gray-400 mt-1">Maks 20 karakter, harus unik</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori <span class="text-red-500">*</span></label>
              <select v-model.number="form.categoryId" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Pilih kategori</option>
                <option v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input v-model.number="form.price" type="number" min="0" required
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stok <span class="text-red-500">*</span></label>
              <input v-model.number="form.stock" type="number" min="0" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat (gram) <span class="text-red-500">*</span></label>
              <input v-model.number="form.weight" type="number" min="0" required
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
            <input v-model="form.isActive" type="checkbox" id="isActive"
              class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            <label for="isActive" class="text-sm font-medium text-gray-700 cursor-pointer">Produk Aktif</label>
          </div>

          <div class="flex gap-3 pt-2 border-t border-gray-100">
            <button @click="closeModal"
              class="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button @click="submitModal" :disabled="modalSaving"
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

const store = useProductsStore()
const categoriesStore = useCategoriesStore()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const searchInput = ref(store.query.search || '')
const categoryFilter = ref<number | null>(store.query.categoryId ?? null)
const statusFilter = ref<boolean | null>(store.query.isActive ?? null)
const sortField = ref(store.query.sortBy || 'createdAt')
const archiveTarget = ref<Product | null>(null)

// Modal state
const modalOpen = ref(false)
const editTarget = ref<Product | null>(null)
const modalLoading = ref(false)
const modalSaving = ref(false)
const modalError = ref('')
const form = reactive<Partial<Product>>({
  name: '', sku: '', categoryId: undefined,
  price: 0, stock: 0, weight: 0,
  width: 0, length: 0, height: 0,
  image: '', description: '', isActive: true,
})

const debouncedSearch = useDebounce(searchInput, 400)

watch(debouncedSearch, (val) => store.fetchProducts({ search: val, page: 1 }))
watch(categoryFilter, (val) => store.fetchProducts({ categoryId: val, page: 1 }))
watch(statusFilter, (val) => store.fetchProducts({ isActive: val, page: 1 }))
watch(sortField, (val) => store.fetchProducts({ sortBy: val, page: 1 }))

function toggleSort() {
  const next = store.query.sortOrder === 'DESC' ? 'ASC' : 'DESC'
  store.fetchProducts({ sortOrder: next, page: 1 })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

function confirmArchive(product: Product) {
  archiveTarget.value = product
}

async function doArchive() {
  if (!archiveTarget.value) return
  await store.archiveProduct(archiveTarget.value.id)
  archiveTarget.value = null
}

function resetForm() {
  Object.assign(form, {
    name: '', sku: '', categoryId: undefined,
    price: 0, stock: 0, weight: 0,
    width: 0, length: 0, height: 0,
    image: '', description: '', isActive: true,
  })
  modalError.value = ''
}

function openCreate() {
  editTarget.value = null
  resetForm()
  modalOpen.value = true
}

async function openEdit(product: Product) {
  editTarget.value = product
  resetForm()
  modalOpen.value = true
  modalLoading.value = true
  try {
    const token = authStore.token
    const data = await $fetch<Product>(`/products/${product.id}`, {
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

function closeModal() {
  modalOpen.value = false
  editTarget.value = null
}

async function submitModal() {
  modalSaving.value = true
  modalError.value = ''
  try {
    const token = authStore.token
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
    const { id, categoryName, createdAt, updatedAt, ...payload } = form as any
    if (editTarget.value) {
      await $fetch(`/products/${editTarget.value.id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase as string,
        headers,
        body: payload,
      })
    } else {
      await $fetch('/products', {
        method: 'POST',
        baseURL: config.public.apiBase as string,
        headers,
        body: payload,
      })
    }
    closeModal()
    await store.fetchProducts()
  } catch (e: any) {
    const msg = e?.data?.message
    modalError.value = Array.isArray(msg) ? msg.join(', ') : msg || 'Gagal menyimpan produk'
  } finally {
    modalSaving.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    store.fetchProducts(),
    categoriesStore.fetchCategories(),
  ])
})
</script>
