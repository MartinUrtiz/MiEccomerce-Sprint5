import { useParams } from 'react-router-dom'

function ProductView() {
  const { id } = useParams()

  return (
    <section className="flex max-w-3xl flex-col gap-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-zinc-500">Producto #{id}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Detalle del producto</h1>
      </header>

      <article className="rounded-xl bg-[#2d2d2d] p-6 shadow-lg">
        <div className="mb-5 h-36 w-36 rounded-xl bg-zinc-300" />
        <h2 className="text-xl font-semibold text-white">Producto seleccionado</h2>
        <p className="mt-2 text-zinc-400">Contenido cargado dentro de la seccion Main Area.</p>
      </article>
    </section>
  )
}

export default ProductView