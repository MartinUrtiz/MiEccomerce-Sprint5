import { Link } from 'react-router-dom'

const stores = [
  { id: 'central', name: 'Tienda Central', products: 42 },
  { id: 'norte', name: 'Tienda Norte', products: 21 },
  { id: 'sur', name: 'Tienda Sur', products: 18 },
  { id: 'online', name: 'Tienda Online', products: 42 },
]

function CategoriesList() {
  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Tiendas</h1>
        <button className="self-start rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273] sm:self-auto">
          Agregar Tienda
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {stores.map((store) => (
          <Link
            key={store.id}
            to={`/categorias/${store.id}`}
            className="rounded-xl bg-[#2d2d2d] p-5 shadow-md transition hover:bg-[#363636]"
          >
            <p className="text-lg font-semibold text-white">{store.name}</p>
            <p className="mt-2 text-sm text-zinc-400">{store.products} productos disponibles</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoriesList
