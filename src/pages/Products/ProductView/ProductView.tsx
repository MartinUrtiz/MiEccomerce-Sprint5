import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resolveProductImage, type Product, type ProductInput } from '../../../services/api'
import { useProduct, useUpdateProduct, useDeleteProduct } from '../../../hooks/useProducts'

// ── Tipo del formulario local ────────────────────────────────────────────────
// Los "images" se editan como array de strings (URLs); el backend devuelve
// objetos {id, url}, así que al cargar el producto los mapeamos a string[].

interface FormState {
  name: string
  price: string
  stock: number
  description: string
  category: string
  image: string
  images: string[]
}

function toFormState(product: {
  name: string
  price: number
  stock: number
  description: string | null
  category: string | null
  image: string | null
  images: { url: string }[]
}): FormState {
  return {
    name: product.name,
    price: String(product.price),
    stock: product.stock,
    description: product.description || '',
    category: product.category || '',
    image: product.image || '',
    images: product.images.map((img) => img.url),
  }
}

function ProductView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, status } = useProduct(id ?? null)
  const { updateProduct, status: saveStatus, error: saveError } = useUpdateProduct()
  const { deleteProduct, status: deleteStatus, error: deleteError } = useDeleteProduct()

  const [form, setForm] = useState<FormState | null>(null)
  const [loadedProduct, setLoadedProduct] = useState<Product | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [formError, setFormError] = useState('')

  // Cuando llega el producto (o cambia), precargamos el formulario.
  // Se ajusta durante el render en vez de un useEffect, siguiendo el patron
  // de React para "adjust state when a prop changes" (evita un render extra).
  if (product && product.id !== loadedProduct?.id) {
    setLoadedProduct(product)
    setForm(toFormState(product))
  }

  if (status === 'error') {
    return (
      <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
        No se pudo cargar el producto.
      </p>
    )
  }

  if (!loadedProduct || !form) return <p className="text-zinc-400">Cargando producto...</p>

  const image = resolveProductImage(loadedProduct.image)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current))
  }

  function handleStockStep(delta: number) {
    setForm((current) => {
      if (!current) return current
      const next = Math.max(0, current.stock + delta)
      return { ...current, stock: next }
    })
  }

  function handleAddImage() {
    const url = newImageUrl.trim()
    if (!url || !form) return
    updateField('images', [...form.images, url])
    setNewImageUrl('')
  }

  function handleRemoveImage(index: number) {
    if (!form) return
    updateField(
      'images',
      form.images.filter((_, i) => i !== index),
    )
  }

  function handleCancel() {
    if (loadedProduct) setForm(toFormState(loadedProduct))
    setNewImageUrl('')
    setFormError('')
  }

  async function handleSave() {
    if (!form || !loadedProduct) return

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
      featured: loadedProduct.featured,
      stock: form.stock,
      images: form.images,
    }

    try {
      const updated = await updateProduct(loadedProduct.id, payload)
      setLoadedProduct(updated)
      setForm(toFormState(updated))
    } catch {
      // el error ya queda expuesto via saveError
    }
  }

  async function handleDelete() {
    if (!loadedProduct) return
    const confirmed = window.confirm(`¿Eliminar "${loadedProduct.name}"? Esta accion no se puede deshacer.`)
    if (!confirmed) return

    try {
      await deleteProduct(loadedProduct.id)
      navigate('/products')
    } catch {
      // el error ya queda expuesto via deleteError
    }
  }

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      {/* Encabezado: breadcrumb + boton Eliminar */}
      <header className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Productos <span className="mx-1">›</span> <span className="text-white">#{loadedProduct.id}</span>
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteStatus === 'loading'}
          className="rounded-full bg-red-900/60 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-900 disabled:opacity-50"
        >
          {deleteStatus === 'loading' ? 'Eliminando...' : 'Eliminar'}
        </button>
      </header>

      {deleteError && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
          {deleteError}
        </div>
      )}

      {/* Resumen rapido del producto */}
      <article className="flex flex-wrap items-center gap-4 rounded-xl bg-[#2d2d2d] p-4 shadow-md">
        <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-700 text-xs text-zinc-400">
          {image ? <img src={image} alt={loadedProduct.name} className="h-full w-full object-cover" /> : 'Sin imagen'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white">{loadedProduct.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span>
              {loadedProduct.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </span>
            <span>{loadedProduct.stock} stock disponible</span>
            <span className="rounded-full bg-[#3a3a3a] px-3 py-1 text-xs text-zinc-300">
              {loadedProduct.category || 'Sin categoria'}
            </span>
          </div>
        </div>
      </article>

      {/* Formulario de edicion */}
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
        {saveStatus === 'success' && (
          <div className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-200">
            Cambios guardados.
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

        {/* Galeria de imagenes */}
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

        {/* Acciones */}
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

export default ProductView