export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'staff'
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Product {
  id: number
  categoryId: number
  categoryName: string | null
  sku: string
  name: string
  description?: string
  weight: number
  width: number
  length: number
  height: number
  image?: string
  price: number
  isActive: boolean
  stock: number
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: number | null
  isActive?: boolean | null
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface ApiError {
  statusCode: number
  message: string | string[]
}
