import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, resolveProductImage, type Product } from '../../../services/api'

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      getProducts(search)
        .then(setProducts)
        .catch((reason: Error) => {
          if (!controller.signal.aborted) setError(reason.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [search])

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Productos</h1>
          <p className="mt-1 text-sm text-zinc-400">{products.length} productos encontrados</p>
        </div>

        <label className="relative block">
          <span className="sr-only">Buscar productos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar productos"
            className="h-9 w-full rounded-full border border-zinc-600 bg-[#2d2d2d] px-4 pr-10 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 sm:w-72"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                fill="currentColor"
                d="m20.7 19.3-4.2-4.2a7 7 0 1 0-1.4 1.4l4.2 4.2 1.4-1.4ZM5 11a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
              />
            </svg>
          </span>
        </label>
      </header>

      {loading ? <p className="text-zinc-400">Cargando productos...</p> : null}

      {error ? (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
          No se pudo cargar la base de datos: {error}
        </div>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
          {search ? 'No hay productos que coincidan con la busqueda.' : 'La base de datos no tiene productos todavia.'}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const image = resolveProductImage(product.image)

          return (
            <Link
              key={product.id}
              to={`/productos/${product.id}`}
              className="flex items-center gap-4 rounded-xl bg-[#2d2d2d] p-3 text-left shadow-md transition hover:bg-[#363636]"
            >
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-700 text-xs text-zinc-400">
                {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : 'Sin imagen'}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-100">{product.name}</span>
                <span className="block text-xs text-zinc-400">
                  {product.category || 'Sin categoria'} - {product.price.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                  })}
                </span>
              </span>

              <span className="text-lg text-zinc-200" aria-hidden="true">&gt;</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default ProductsList
