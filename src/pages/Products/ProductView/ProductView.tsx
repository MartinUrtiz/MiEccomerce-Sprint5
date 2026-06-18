import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, resolveProductImage, type Product } from '../../../services/api'

function ProductView() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getProduct(id).then(setProduct).catch((reason: Error) => setError(reason.message))
  }, [id])

  if (error) {
    return <p className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">{error}</p>
  }

  if (!product) return <p className="text-zinc-400">Cargando producto...</p>

  const image = resolveProductImage(product.image)

  return (
    <section className="flex max-w-3xl flex-col gap-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-zinc-500">Producto #{product.id}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{product.name}</h1>
      </header>

      <article className="grid gap-6 rounded-xl bg-[#2d2d2d] p-6 shadow-lg sm:grid-cols-[180px_1fr]">
        <div className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-zinc-700 text-zinc-400">
          {image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : 'Sin imagen'}
        </div>
        <div>
          <p className="text-sm text-zinc-400">{product.category || 'Sin categoria'}</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {product.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
          </p>
          <p className="mt-5 leading-7 text-zinc-300">{product.description || 'Sin descripcion.'}</p>
        </div>
      </article>
    </section>
  )
}

export default ProductView
