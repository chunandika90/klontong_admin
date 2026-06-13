<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-0.5">Selamat datang, {{ authStore.user?.name }}</p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <NuxtLink to="/products" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
        <p class="text-sm text-gray-500">Total Produk</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
        <p class="text-xs text-gray-400 mt-1">semua produk terdaftar</p>
      </NuxtLink>
      <NuxtLink to="/products?isActive=true" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-sm transition-all">
        <p class="text-sm text-gray-500">Produk Aktif</p>
        <p class="text-3xl font-bold text-green-600 mt-1">{{ stats.active }}</p>
        <p class="text-xs text-gray-400 mt-1">tersedia untuk dijual</p>
      </NuxtLink>
      <NuxtLink to="/products?lowStock=true" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-red-300 hover:shadow-sm transition-all">
        <p class="text-sm text-gray-500">Stok Menipis</p>
        <p class="text-3xl font-bold text-red-500 mt-1">{{ stats.lowStock }}</p>
        <p class="text-xs text-gray-400 mt-1">stok di bawah 10 unit</p>
      </NuxtLink>
      <NuxtLink to="/products?archived=true" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-sm transition-all">
        <p class="text-sm text-gray-500">Produk Diarsip</p>
        <p class="text-3xl font-bold text-orange-500 mt-1">{{ stats.archived }}</p>
        <p class="text-xs text-gray-400 mt-1">tidak aktif / diarsipkan</p>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Low stock products -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900">Stok Menipis</h2>
          <NuxtLink to="/products" class="text-xs text-indigo-600 hover:underline">Lihat semua</NuxtLink>
        </div>
        <div v-if="loading" class="p-5 space-y-3">
          <div v-for="i in 4" :key="i" class="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
        <div v-else-if="lowStockProducts.length === 0" class="p-5 text-center text-gray-400 text-sm py-8">
          Tidak ada produk dengan stok menipis
        </div>
        <ul v-else class="divide-y divide-gray-100">
          <li v-for="p in lowStockProducts" :key="p.id">
            <NuxtLink :to="`/products/${p.id}`" class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ p.name }}</p>
                <p class="text-xs text-gray-400">{{ p.sku }}</p>
              </div>
              <span class="text-sm font-bold text-red-500">{{ p.stock }} unit</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Recent products -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900">Produk Terbaru</h2>
          <NuxtLink to="/products" class="text-xs text-indigo-600 hover:underline">Lihat semua</NuxtLink>
        </div>
        <div v-if="loading" class="p-5 space-y-3">
          <div v-for="i in 4" :key="i" class="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
        <ul v-else class="divide-y divide-gray-100">
          <li v-for="p in recentProducts" :key="p.id">
            <NuxtLink :to="`/products/${p.id}`" class="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-3">
                <img
                  :src="p.image || 'https://placehold.co/40x40/e5e7eb/9ca3af?text=?'"
                  :alt="p.name"
                  class="w-8 h-8 rounded-lg object-cover bg-gray-100"
                  @error="($event.target as HTMLImageElement).src = 'https://placehold.co/40x40/e5e7eb/9ca3af?text=?'"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ p.name }}</p>
                  <p class="text-xs text-gray-400">{{ p.categoryName }}</p>
                </div>
              </div>
              <span class="text-sm font-medium text-gray-700">{{ formatPrice(p.price) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Chart per kategori -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-900 mb-5">Sebaran Produk per Kategori</h2>
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-8 bg-gray-100 rounded animate-pulse" />
      </div>
      <div v-else-if="stats.perCategory.length === 0" class="text-center text-gray-400 text-sm py-8">
        Belum ada data kategori
      </div>
      <div v-else class="space-y-3">
        <div v-for="cat in stats.perCategory" :key="cat.categoryName" class="flex items-center gap-3">
          <div class="w-28 text-sm text-gray-600 text-right shrink-0 truncate" :title="cat.categoryName">
            {{ cat.categoryName }}
          </div>
          <div class="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              class="h-6 rounded-full bg-indigo-500 flex items-center px-2 transition-all duration-500"
              :style="{ width: barWidth(cat.count) }"
            >
              <span class="text-xs text-white font-medium">{{ cat.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const config = useRuntimeConfig()

interface CategoryStat { categoryName: string; count: number }
const stats = reactive({
  total: 0, active: 0, archived: 0, lowStock: 0,
  perCategory: [] as CategoryStat[],
})
const lowStockProducts = ref<Product[]>([])
const recentProducts = ref<Product[]>([])
const loading = ref(true)

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

function barWidth(count: number) {
  const max = Math.max(...stats.perCategory.map(c => c.count), 1)
  return `${Math.max((count / max) * 100, 4)}%`
}

onMounted(async () => {
  const token = authStore.token
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const base = config.public.apiBase as string

  const [statsRes, lowRes, recentRes] = await Promise.allSettled([
    $fetch<any>('/products/stats', { baseURL: base, headers }),
    $fetch<any>('/products?limit=5&page=1&sortBy=stock&sortOrder=ASC', { baseURL: base, headers }),
    $fetch<any>('/products?limit=5&page=1&sortBy=createdAt&sortOrder=DESC', { baseURL: base, headers }),
  ])

  if (statsRes.status === 'fulfilled') {
    const s = statsRes.value
    stats.total = s.total ?? 0
    stats.active = s.active ?? 0
    stats.archived = s.archived ?? 0
    stats.lowStock = s.lowStock ?? 0
    stats.perCategory = s.perCategory ?? []
  }

  if (lowRes.status === 'fulfilled') {
    lowStockProducts.value = (lowRes.value.data ?? []).filter((p: Product) => p.stock < 10)
  }

  if (recentRes.status === 'fulfilled') {
    recentProducts.value = recentRes.value.data ?? []
  }

  loading.value = false
})
</script>
