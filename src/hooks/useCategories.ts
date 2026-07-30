import { useEffect, useState } from 'react'
import { API_URL, type Category, type CategoryInput } from '../services/api'

type Status = 'loading' | 'success' | 'error'

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function fetchCategory(id: number | string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error)
    return null
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<Status>('loading')

  function load() {
    setStatus('loading')
    fetchCategories()
      .then((data) => {
        setCategories(data)
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }

  useEffect(() => {
    load()
  }, [])

  return {
    data: categories,
    status,
    refetch: load,
  }
}

export function useCategory(id: number | string | null) {
  const [category, setCategory] = useState<Category | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (id) {
      fetchCategory(id)
        .then((data) => {
          setCategory(data)
          setStatus('success')
        })
        .catch(() => {
          setStatus('error')
        })
    }
  }, [id])

  return {
    data: category,
    status,
  }
}

async function postCategory(payload: CategoryInput): Promise<Category> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.error || `Error HTTP ${response.status}`)
  }

  return body.data
}

export function useCreateCategory() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function createCategory(payload: CategoryInput) {
    setStatus('loading')
    setError('')
    try {
      const created = await postCategory(payload)
      setStatus('success')
      return created
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al crear la categoría.')
      throw err
    }
  }

  return { createCategory, status, error }
}

async function putCategory(id: number | string, payload: CategoryInput): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
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

export function useUpdateCategory() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function updateCategory(id: number | string, payload: CategoryInput) {
    setStatus('loading')
    setError('')
    try {
      const updated = await putCategory(id, payload)
      setStatus('success')
      return updated
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al guardar la categoría.')
      throw err
    }
  }

  return { updateCategory, status, error }
}

async function deleteCategoryRequest(id: number | string): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Error HTTP ${response.status}`)
  }
}

export function useDeleteCategory() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function deleteCategory(id: number | string) {
    setStatus('loading')
    setError('')
    try {
      await deleteCategoryRequest(id)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al eliminar la categoría.')
      throw err
    }
  }

  return { deleteCategory, status, error }
}
