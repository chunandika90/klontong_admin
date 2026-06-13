/**
 * Deteksi status koneksi internet secara realtime.
 * Tampilkan banner kalau user offline.
 */
export function useNetworkStatus() {
  const isOnline = ref(true)

  function update() {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
  })

  onUnmounted(() => {
    window.removeEventListener('online', update)
    window.removeEventListener('offline', update)
  })

  return { isOnline }
}
