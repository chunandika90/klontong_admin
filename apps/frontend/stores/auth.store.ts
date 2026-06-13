import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    setAuth(token: string, user: User) {
      this.token = token
      this.user = user
      if (process.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },
    logout() {
      this.token = null
      this.user = null
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    },
    loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userRaw = localStorage.getItem('auth_user')
        if (token && userRaw) {
          this.token = token
          this.user = JSON.parse(userRaw)
        }
      }
    },
  },
})
