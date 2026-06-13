/**
 * Composable untuk handle:
 * 1. Auto-cancel request kalau komponen di-unmount (pindah halaman)
 * 2. Deteksi internet putus
 * 3. Retry otomatis kalau network error (max 3x)
 */
export function useRequest() {
  const controller = ref<AbortController | null>(null)

  // Cancel request sebelumnya kalau ada yang masih jalan
  function createAbortController() {
    if (controller.value) controller.value.abort()
    controller.value = new AbortController()
    return controller.value
  }

  // Auto-cancel saat komponen di-destroy (navigasi ke halaman lain)
  onUnmounted(() => {
    if (controller.value) {
      controller.value.abort()
    }
  })

  async function request<T>(
    fn: () => Promise<T>,
    options: { retries?: number } = {}
  ): Promise<T> {
    const maxRetries = options.retries ?? 2
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        // Cek koneksi sebelum kirim request
        if (!navigator.onLine) {
          throw new Error('Tidak ada koneksi internet. Periksa jaringan kamu.')
        }

        return await fn()

      } catch (err: any) {
        const isAborted = err?.name === 'AbortError'
        const isNetworkError = err?.message?.includes('fetch') || err?.message?.includes('network')
        const isOffline = err?.message?.includes('internet')

        // Kalau sengaja di-abort (navigasi) → jangan retry, diam saja
        if (isAborted) throw err

        // Kalau offline → langsung throw, jangan retry
        if (isOffline) throw err

        // Kalau network error dan masih ada sisa retry → coba lagi
        if (isNetworkError && attempt < maxRetries) {
          attempt++
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // backoff
          continue
        }

        throw err
      }
    }
  }

  return { request, createAbortController }
}
