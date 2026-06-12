import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm uppercase tracking-wide text-zinc-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Pagina no encontrada</h1>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-full bg-[#596162] px-4 py-2 text-sm font-semibold text-white hover:bg-[#697273]"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}

export default NotFound