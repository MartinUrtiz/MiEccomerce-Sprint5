import { Link } from 'react-router-dom'

const products = [
  {
    id: '123456',
    name: 'Alfajores Havanna Chocolate 12 Unidades',
    image: '/favicon.svg',
  },
  { id: '999', name: 'Product 2' },
  { id: '071', name: 'Product 3' },
  { id: '0289', name: 'Product 4' },
  { id: '456', name: 'Product 5' },
  { id: '3456', name: 'Product 6' },
  { id: '123', name: 'Product 7' },
  { id: '8', name: 'Product 8' },
]

function ProductsList() {
  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Productos</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block">
            <span className="sr-only">Buscar productos</span>
            <input
              type="search"
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

          <button className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273]">
            Agregar Producto
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/productos/${product.id}`}
            className="flex items-center gap-4 rounded-xl bg-[#2d2d2d] p-3 text-left shadow-md transition hover:bg-[#363636]"
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-300 text-xs text-zinc-700">
              {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : null}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-100">{product.name}</span>
              <span className="block text-xs text-zinc-400">#{product.id}</span>
            </span>

            <span className="text-lg text-zinc-200" aria-hidden="true">
              &gt;
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProductsList