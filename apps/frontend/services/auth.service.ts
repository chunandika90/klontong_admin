import type { User } from '~/types'

export const authService = {
  me(): Promise<User> {
    return apiFetch('/auth/me')
  },
}
