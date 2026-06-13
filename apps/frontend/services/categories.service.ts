import type { Category } from '~/types'

export const categoriesService = {
  getAll(): Promise<Category[]> {
    return apiFetch('/categories')
  },
}
