import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../../../../hooks/useProducts'

function CategoryView() {
  const { id = '' } = useParams()
  const category = decodeURIComponent(id)
  const { data: allProducts, status } = useProducts()
  const products = allProducts.filter((product) => (product.category || 'Sin categoria') === category)
  const error = status === 'error' ? 'No se pudo cargar la base de datos.' : ''

  return (
    <section className="flex max-w-3xl flex-col gap-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-zinc-500">Categoria</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{category}</h1>
      </header>

      {error ? <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}</p> : null}

      <div className="flex flex-col gap-3">
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
