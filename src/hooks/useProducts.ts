import { useEffect, useState } from 'react'
import { API_URL, type Product, type ProductInput } from '../services/api'

type Status = 'loading' | 'success' | 'error'

async function fetchProducts(search = ''): Promise<Product[]> {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    const response = await fetch(`${API_URL}/products${query}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function fetchProduct(id: number | string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    return null
  }
}

export function useProducts(search = '') {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    fetchProducts(search)
      .then((data) => {
        setProducts(data)
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [search])

  const refetch = () => {
    setProducts([])
    setStatus('loading')
    fetchProducts(search)
      .then((data) => {
        setProducts(data)
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return {
    data: products,
    status,
    refetch,
  }
}

export function useProduct(id: number | string | null) {
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (id) {
      fetchProduct(id)
        .then((data) => {
          setProduct(data)
          setStatus('success')
        })
        .catch(() => {
          setStatus('error')
        })
    }
  }, [id])

  return {
    data: product,
    status,
  }
}

async function putProduct(id: number | string, payload: ProductInput): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.error || `Error HTTP ${response.status}`)
  }

  return body.data
}

async function deleteProductRequest(id: number | string): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Error HTTP ${response.status}`)
  }
}

export function useUpdateProduct() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function updateProduct(id: number | string, payload: ProductInput) {
    setStatus('loading')
    setError('')
    try {
      const updated = await putProduct(id, payload)
      setStatus('success')
      return updated
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al guardar el producto.')
      throw err
    }
  }

  return { updateProduct, status, error }
}

export function useDeleteProduct() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function deleteProduct(id: number | string) {
    setStatus('loading')
    setError('')
    try {
      await deleteProductRequest(id)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto.')
      throw err
    }
  }

  return { deleteProduct, status, error }
}