let _baseURL = ''
let _getToken: () => string | null = () => null

export function initApi(baseURL: string, getToken: () => string | null) {
  _baseURL = baseURL
  _getToken = getToken
}

export function apiFetch<T = any>(url: string, options: Record<string, any> = {}): Promise<T> {
  const token = _getToken()
  return $fetch<T>(url, {
    baseURL: _baseURL,
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}
