import type { Product, PaginatedResponse, ProductQuery } from '~/types'

export const productsService = {
  getAll(query: ProductQuery = {}): Promise<PaginatedResponse<Product>> {
    const params: Record<string, any> = {}
    if (query.page) params.page = query.page
    if (query.limit) params.limit = query.limit
    if (query.search) params.search = query.search
    if (query.categoryId != null) params.categoryId = query.categoryId
    if (query.isActive != null) params.isActive = query.isActive
    if (query.sortBy) params.sortBy = query.sortBy
    if (query.sortOrder) params.sortOrder = query.sortOrder
    return apiFetch('/products', { params })
  },
  getOne(id: number): Promise<Product> {
    return apiFetch(`/products/${id}`)
  },
  create(data: Partial<Product>): Promise<Product> {
    return apiFetch('/products', { method: 'POST', body: data })
  },
  update(id: number, data: Partial<Product>): Promise<Product> {
    return apiFetch(`/products/${id}`, { method: 'PATCH', body: data })
  },
  archive(id: number): Promise<{ message: string }> {
    return apiFetch(`/products/${id}`, { method: 'DELETE' })
  },
  restore(id: number): Promise<Product> {
    return apiFetch(`/products/${id}/restore`, { method: 'PATCH' })
  },
}
