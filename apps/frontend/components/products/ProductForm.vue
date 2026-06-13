<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" required maxlength="200"
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
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
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

    <div class="sm:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
      <textarea v-model="form.description" rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
    </div>

    <div class="flex items-center gap-3">
      <label class="flex items-center gap-2 cursor-pointer">
        <input v-model="form.isActive" type="checkbox"
          class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
        <span class="text-sm font-medium text-gray-700">Produk Aktif</span>
      </label>
    </div>

    <div class="flex gap-3 pt-2">
      <button type="button" @click="$router.back()"
        class="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
        Batal
      </button>
      <button type="button" @click="handleSubmit" :disabled="loading"
        class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
        {{ loading ? 'Menyimpan...' : 'Simpan Produk' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{
  initial?: Product | null
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [data: Partial<Product>]
}>()

const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.items)

const form = reactive<Partial<Product>>({
  name: '',
  sku: '',
  categoryId: undefined,
  price: 0,
  stock: 0,
  weight: 0,
  width: 0,
  length: 0,
  height: 0,
  image: '',
  description: '',
  isActive: true,
})

onMounted(async () => {
  await categoriesStore.fetchCategories()
  if (props.initial) Object.assign(form, props.initial)
})

function handleSubmit() {
  emit('submit', { ...form })
}
</script>
