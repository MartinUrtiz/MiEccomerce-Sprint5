const API_URL = import.meta.env.VITE_API_URL || '/api'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export interface Product {
  id: number
  name: string
  price: number
  category: string | null
  description: string | null
  image: string | null
  featured: number
}

export interface Order {
  id: number
  user_id: number | null
  user_name: string | null
  user_email: string | null
  created_at: string
  total_units: number
  total: number
}

export interface DashboardStats {
  summary: {
    products: number
    users: number
    orders: number
    revenue: number
  }
  salesByCategory: Array<{
    category: string
    units: number
    revenue: number
  }>
  recentOrders: Order[]
}

interface ApiResponse<T> {
  data: T
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Error HTTP ${response.status}`)
  }

  if (response.status === 204) return undefined as T

  const body: ApiResponse<T> = await response.json()
  return body.data
}

export function getProducts(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return request<Product[]>(`/products${query}`)
}

export function getProduct(id: string) {
  return request<Product>(`/products/${id}`)
}

export function getDashboardStats() {
  return request<DashboardStats>('/dashboard/stats')
}

export function resolveProductImage(image: string | null) {
  if (!image) return null
  if (/^https?:\/\//i.test(image)) return image
  return `${BACKEND_URL}${image.startsWith('/') ? '' : '/'}${image}`
}
