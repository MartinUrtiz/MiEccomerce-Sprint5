import { Link } from 'react-router-dom'
import { useCategories } from '../../../../hooks/useCategories'
import { useProducts } from '../../../../hooks/useProducts'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="currentColor" d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2Z" />
    </svg>
  )
}

function CategoriesList() {
  const { data: categories, status } = useCategories()
  const { data: products } = useProducts()

  const loading = status === 'loading'
  const error = status === 'error' ? 'No se pudo cargar la base de datos.' : ''

  const countByCategory = products.reduce((result, product) => {
    const category = product.category || 'Sin categoria'
    result.set(category, (result.get(category) || 0) + 1)
    return result
  }, new Map<string, number>())

  return (
    <section className="flex flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categorías</h1>
          <p className="mt-1 text-sm text-zinc-400">Categorías registradas en la base de datos</p>
        </div>

        <Link
          to="/categories/new"
          aria-label="Agregar Categoría"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#596162] text-white transition hover:bg-[#697273] sm:flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:font-semibold"
        >
          <PlusIcon />
          <span className="hidden sm:inline">Agregar Categoría</span>
        </Link>
      </header>

      {loading ? <p className="text-zinc-400">Cargando categorías...</p> : null}
      {error ? <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}</p> : null}

      {!loading && !error && categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
          Todavía no hay categorías creadas.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="rounded-xl bg-[#2d2d2d] p-5 shadow-md transition hover:bg-[#363636]"
          >
            <p className="text-lg font-semibold text-white">{category.name}</p>
            <p className="mt-2 text-sm text-zinc-400">
              {countByCategory.get(category.name) || 0} productos
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoriesList
