import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, type Product } from '../../../../services/api'

function CategoriesList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = Array.from(
    products.reduce((result, product) => {
      const category = product.category || 'Sin categoria'
      result.set(category, (result.get(category) || 0) + 1)
      return result
    }, new Map<string, number>()),
  )

  return (
    <section className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold text-white">Categorias</h1>
        <p className="mt-1 text-sm text-zinc-400">Agrupadas desde los productos de Sprint3</p>
      </header>

      {loading ? <p className="text-zinc-400">Cargando categorias...</p> : null}
      {error ? <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}</p> : null}

      {!loading && !error && categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
          No hay categorias porque la base de datos no tiene productos todavia.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(([category, count]) => (
          <Link
            key={category}
            to={`/categorias/${encodeURIComponent(category)}`}
            className="rounded-xl bg-[#2d2d2d] p-5 shadow-md transition hover:bg-[#363636]"
          >
            <p className="text-lg font-semibold text-white">{category}</p>
            <p className="mt-2 text-sm text-zinc-400">{count} productos</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoriesList
