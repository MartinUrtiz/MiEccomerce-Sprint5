import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductInput } from '../../../services/api'
import { useCreateProduct } from '../../../hooks/useProducts'

interface FormState {
  name: string
  price: string
  stock: number
  description: string
  category: string
  image: string
  images: string[]
}

const emptyForm: FormState = {
  name: '',
  price: '',
  stock: 0,
  description: '',
  category: '',
  image: '',
  images: [],
}

function ProductNew() {
  const navigate = useNavigate()
  const { createProduct, status: saveStatus, error: saveError } = useCreateProduct()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [formError, setFormError] = useState('')

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleStockStep(delta: number) {
    setForm((current) => ({ ...current, stock: Math.max(0, current.stock + delta) }))
  }

  function handleAddImage() {
    const url = newImageUrl.trim()
    if (!url) return
    updateField('images', [...form.images, url])
    setNewImageUrl('')
  }

  function handleRemoveImage(index: number) {
    updateField(
      'images',
      form.images.filter((_, i) => i !== index),
    )
  }

  function handleCancel() {
    setForm(emptyForm)
    setNewImageUrl('')
    setFormError('')
  }

  async function handleSave() {
    const name = form.name.trim()
    const price = Number(form.price)

    if (!name) {
      setFormError('El nombre es obligatorio.')
      return
    }
    if (!Number.isFinite(price) || price < 0) {
      setFormError('El valor debe ser un numero mayor o igual a cero.')
      return
    }
    if (!Number.isInteger(form.stock) || form.stock < 0) {
      setFormError('El stock debe ser un numero entero mayor o igual a cero.')
      return
    }

    setFormError('')

    const payload: ProductInput = {
      name,
      price,
      category: form.category.trim() || null,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      featured: 0,
      stock: form.stock,
      images: form.images,
    }

    try {
      const created = await createProduct(payload)
      navigate(`/products/${created.id}`)
    } catch {
      // el error ya queda expuesto via saveError
    }
  }

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Agregar Producto</h1>
        <p className="mt-1 text-sm text-zinc-400">Completa los datos del nuevo producto</p>
      </header>

      <div className="flex flex-col gap-5 rounded-xl bg-[#2d2d2d] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white">Información</h2>

        {formError && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
            {formError}
          </div>
        )}
        {saveError && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
            {saveError}
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Nombre
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Valor
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            className="rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-zinc-300">
          Stock
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStockStep(-1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#3a3a3a] text-white transition hover:bg-[#4a4a4a]"
              aria-label="Restar stock"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              step={1}
              value={form.stock}
              onChange={(e) => updateField('stock', Math.max(0, Math.trunc(Number(e.target.value) || 0)))}
              className="w-20 rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-center text-white outline-none focus:border-zinc-400"
            />
            <button
              type="button"
              onClick={() => handleStockStep(1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#3a3a3a] text-white transition hover:bg-[#4a4a4a]"
              aria-label="Sumar stock"
            >
              +
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Descripción
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            className="resize-none rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Categoría
          <input
            type="text"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="Sin categoria"
            className="rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Imagen principal (URL)
          <input
            type="text"
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

        <div className="flex flex-col gap-2 text-sm text-zinc-300">
          Galería de imágenes

          {form.images.length === 0 && (
            <p className="text-xs text-zinc-500">Todavía no hay imágenes en la galería.</p>
          )}

          <ul className="flex flex-col gap-2">
            {form.images.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-[#242424] px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="shrink-0 rounded-full bg-[#3a3a3a] px-3 py-1 text-xs text-zinc-200 transition hover:bg-red-900/60"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Nueva imagen (URL)"
              className="flex-1 rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="shrink-0 rounded-full bg-[#3a3a3a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4a4a4a]"
            >
              Agregar
            </button>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-[#3a3a3a]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'loading'}
            className="rounded-full bg-[#596162] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#697273] disabled:opacity-50"
          >
            {saveStatus === 'loading' ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductNew