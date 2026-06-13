<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Offline banner -->
    <Transition name="slide-down">
      <div
        v-if="!isOnline"
        class="bg-red-500 text-white text-sm text-center py-2 px-4 flex items-center justify-center gap-2"
      >
        <span>Tidak ada koneksi internet — perubahan tidak akan tersimpan</span>
      </div>
    </Transition>

    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-6">
            <NuxtLink to="/" class="text-xl font-bold text-indigo-600">
              Klontong Admin
            </NuxtLink>
            <NuxtLink
              to="/"
              class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              active-class="text-indigo-600"
              :exact="true"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/products"
              class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              active-class="text-indigo-600"
            >
              Produk
            </NuxtLink>
          </div>
          <div class="flex items-center gap-3">
            <!-- Indikator offline di navbar -->
            <span v-if="!isOnline" class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Offline
            </span>
            <span class="text-sm text-gray-500">{{ authStore.user?.name }}</span>
            <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full capitalize">
              {{ authStore.user?.role }}
            </span>
            <button
              @click="logout"
              class="text-sm text-gray-500 hover:text-red-600 transition-colors ml-2"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { isOnline } = useNetworkStatus()

function logout() {
  authStore.logout()
  navigateTo('/auth/login')
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
