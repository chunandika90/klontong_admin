import { defineStore } from 'pinia'
import type { Product, PaginatedResponse, ProductQuery } from '~/types'
import { productsService } from '~/services/products.service'

interface ProductsState {
  items: Product[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  query: ProductQuery
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    items: [],
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
    query: {
      page: 1,
      limit: 10,
      search: '',
      categoryId: null,
      isActive: null,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    },
  }),
  actions: {
    async fetchProducts(query?: Partial<ProductQuery>) {
      if (query) Object.assign(this.query, query)
      this.loading = true
      this.error = null
      try {
        const res = await productsService.getAll(this.query)
        this.items = res.data
        this.total = res.meta.total
        this.totalPages = res.meta.totalPages
      } catch (e: any) {
        this.error = e?.data?.message || 'Failed to load products'
      } finally {
        this.loading = false
      }
    },
    async archiveProduct(id: number) {
      await productsService.archive(id)
      await this.fetchProducts()
    },
    setPage(page: number) {
      this.fetchProducts({ page })
    },
  },
})
