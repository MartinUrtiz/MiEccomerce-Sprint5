import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCategory, useUpdateCategory, useDeleteCategory } from '../../../../hooks/useCategories'
import { useProducts } from '../../../../hooks/useProducts'

function CategoryView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: category, status } = useCategory(id ?? null)
  const { updateCategory, status: saveStatus, error: saveError } = useUpdateCategory()
  const { deleteCategory, status: deleteStatus, error: deleteError } = useDeleteCategory()

  const { data: allProducts, status: productsStatus } = useProducts()

  const [name, setName] = useState<string | null>(null)
  const [loadedCategoryId, setLoadedCategoryId] = useState<number | null>(null)
  const [formError, setFormError] = useState('')

  // Precarga el input cuando llega/cambia la categoría (evita un useEffect extra)
  if (category && category.id !== loadedCategoryId) {
    setLoadedCategoryId(category.id)
    setName(category.name)
  }

  if (status === 'error') {
    return (
      <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
        No se pudo cargar la categoría.
      </p>
    )
  }

  if (!category || name === null) {
    return <p className="text-zinc-400">Cargando categoría...</p>
  }

  const products = allProducts.filter(
    (product) => (product.category || 'Sin categoria') === category.name,
  )
  const productsError = productsStatus === 'error' ? 'No se pudo cargar la base de datos.' : ''

  function handleCancel() {
    setName(category!.name)
    setFormError('')
  }

  async function handleSave() {
    const trimmed = (name ?? '').trim()

    if (!trimmed) {
      setFormError('El nombre es obligatorio.')
      return
    }

    setFormError('')

    try {
      await updateCategory(category!.id, { name: trimmed })
    } catch {
      // el error ya queda expuesto via saveError
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(`¿Eliminar "${category!.name}"? Esta accion no se puede deshacer.`)
    if (!confirmed) return

    try {
      await deleteCategory(category!.id)
      navigate('/categories')
    } catch {
      // el error ya queda expuesto via deleteError
    }
  }

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      <header className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Categorías <span className="mx-1">›</span> <span className="text-white">{category.name}</span>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

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

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Productos en esta categoría</h2>

        {productsError ? (
          <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{productsError}</p>
        ) : null}

        {!productsError && products.length === 0 ? (
          <p className="text-sm text-zinc-400">No hay productos con esta categoría todavía.</p>
        ) : null}

        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="flex items-center justify-between rounded-xl bg-[#2d2d2d] p-4 hover:bg-[#363636]"
          >
            <span className="font-medium text-white">{product.name}</span>
            <span className="text-sm text-zinc-400">
              {product.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryView
