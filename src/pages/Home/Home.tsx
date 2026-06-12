import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="flex flex-col gap-8">
      <header>
        <p className="text-lg text-zinc-200">Hola Admin!</p>
      </header>

      <div className="flex flex-col gap-5">
        <article className="flex items-center justify-between gap-4 rounded-xl bg-[#2d2d2d] p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-zinc-700 text-white">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M12 2 3.5 6.5v11L12 22l8.5-4.5v-11L12 2Zm0 2.3 5.2 2.75L12 9.8 6.8 7.05 12 4.3Zm-6.5 4.4 5.5 2.9v7.45l-5.5-2.9V8.7Zm13 7.45-5.5 2.9V11.6l5.5-2.9v7.45Z"
                />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-white">123 Productos</h1>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Link to="/productos" className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273]">
              Ver Listado
            </Link>
            <button className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273]">
              Agregar Producto
            </button>
          </div>
        </article>

        <article className="flex items-center justify-between gap-4 rounded-xl bg-[#2d2d2d] p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-zinc-700 text-white">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M4 4h16l1 6a4 4 0 0 1-1 2.65V20H4v-7.35A4 4 0 0 1 3 10l1-6Zm2 9.88V18h12v-4.12A4 4 0 0 1 15 13a4 4 0 0 1-3-1.35A4 4 0 0 1 9 13a4 4 0 0 1-3-.12ZM5.7 6 5 10a2 2 0 1 0 4 0l.35-4H5.7Zm5.65 0L11 10a1 1 0 1 0 2 0l-.35-4h-1.3Zm3.3 0L15 10a2 2 0 1 0 4 0l-.7-4h-3.65Z"
                />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-white">10 Tiendas</h2>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Link to="/categorias" className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273]">
              Ver Listado
            </Link>
            <button className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273]">
              Agregar Tienda
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Home
