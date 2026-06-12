import { useParams } from 'react-router-dom'

function CategoryView() {
  const { id } = useParams()

  return (
    <section className="flex max-w-3xl flex-col gap-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-zinc-500">Tienda #{id}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Detalle de tienda</h1>
      </header>

      <article className="rounded-xl bg-[#2d2d2d] p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white">Informacion de la tienda</h2>
        <p className="mt-2 text-zinc-400">Esta vista tambien se carga dentro de la seccion Main Area.</p>
      </article>
    </section>
  )
}

export default CategoryView
