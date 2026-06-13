import { defineStore } from 'pinia'
import type { Category } from '~/types'
import { categoriesService } from '~/services/categories.service'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    items: [] as Category[],
    loaded: false,
  }),
  actions: {
    async fetchCategories() {
      if (this.loaded) return
      this.items = await categoriesService.getAll()
      this.loaded = true
    },
  },
})
