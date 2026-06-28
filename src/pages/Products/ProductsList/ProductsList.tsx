import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, resolveProductImage, type Product } from '../../../services/api'

// ── Íconos ──────────────────────────────────────────────────────────────────

function SearchIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="m20.7 19.3-4.2-4.2a7 7 0 1 0-1.4 1.4l4.2 4.2 1.4-1.4ZM5 11a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="currentColor" d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"
      />
    </svg>
  )
}

// ── Imagen con estado de carga (BONUS) ───────────────────────────────────────

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'idle',
  )

  if (!src) {
    return (
      <span className="grid h-full w-full place-items-center text-xs text-zinc-500">
        Sin imagen
      </span>
    )
  }

  return (
    <>
      {status === 'loading' && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-zinc-300" />
        </span>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={[
          'h-full w-full object-cover transition-opacity duration-300',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
      {status === 'error' && (
        <span className="absolute inset-0 grid place-items-center text-xs text-zinc-500">
          Sin imagen
        </span>
      )}
    </>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // BONUS mobile: estado para expandir la búsqueda en pantallas pequeñas
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function openSearch() {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function closeSearch() {
    setSearchOpen(false)
    setSearch('')
  }

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
    <section className="flex flex-col gap-0 -m-5 sm:-m-6 h-[calc(100vh-72px)]">

      {/* Encabezado sticky */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#242424] px-5 py-4 sm:px-6">

        {/* Título — se oculta en mobile cuando la búsqueda está abierta */}
        <h1
          className={[
            'text-2xl font-semibold text-white transition-all duration-200 whitespace-nowrap',
            searchOpen ? 'hidden' : 'block',
          ].join(' ')}
        >
          Productos
        </h1>

        <div className="flex items-center gap-2 ml-auto">

          {/* ── VERSIÓN MOBILE: botón lupa / input expandido ── */}
          <div className="flex items-center sm:hidden">
            {searchOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Cerrar búsqueda"
                  onClick={closeSearch}
                  className="mr-2 text-zinc-300"
                >
                  <CloseIcon />
                </button>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar productos"
                    className="h-9 w-[calc(100vw-140px)] rounded-full border border-zinc-600 bg-[#2d2d2d] px-4 pr-9 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <SearchIcon />
                  </span>
                </div>
              </>
            ) : (
              <button
                type="button"
                aria-label="Buscar productos"
                onClick={openSearch}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#3a3a3a] text-zinc-300 transition hover:bg-[#4a4a4a]"
              >
                <SearchIcon />
              </button>
            )}
          </div>

          {/* ── VERSIÓN DESKTOP: input siempre visible ── */}
          <div className="relative hidden sm:block">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos"
              className="h-9 w-64 rounded-full border border-zinc-600 bg-[#2d2d2d] px-4 pr-9 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:w-80 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              <SearchIcon />
            </span>
          </div>

          {/* Botón Agregar Producto — ícono en mobile, texto en desktop (BONUS) */}
          <Link
            to="/products/new"
            aria-label="Agregar Producto"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#596162] text-white transition hover:bg-[#697273] sm:flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:font-semibold"
          >
            <PlusIcon />
            <span className="hidden sm:inline">Agregar Producto</span>
          </Link>
        </div>
      </header>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">

        {loading && (
          <p className="text-zinc-400">Cargando productos...</p>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            No se pudo cargar la base de datos: {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center text-zinc-400">
            {search
              ? 'No hay productos que coincidan con la búsqueda.'
              : 'La base de datos no tiene productos todavía.'}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {products.map((product) => {
            const image = resolveProductImage(product.image)

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="flex items-center gap-4 rounded-xl bg-[#2d2d2d] p-3 text-left shadow-md transition hover:bg-[#363636]"
              >
                <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-700">
                  <ProductImage src={image} alt={product.name} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-100">
                    {product.name}
                  </span>
                  <span className="block text-xs text-zinc-400">
                    {product.category || 'Sin categoría'} —{' '}
                    {product.price.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                    })}
                  </span>
                </span>

                <span className="text-lg text-zinc-400" aria-hidden="true">›</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProductsList
