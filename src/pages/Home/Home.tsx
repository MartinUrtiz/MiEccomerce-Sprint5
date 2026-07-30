import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'

const USERNAME = 'Usuario'

interface SectionData {
  count: number
  label: string
  listTo: string
  newTo: string
  newLabel: string
  listLabel: string
  icon: React.ReactNode
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-zinc-300">
      <path
        fill="currentColor"
        d="M12 2 3.5 6.5v11L12 22l8.5-4.5v-11L12 2Zm0 2.3 5.2 2.75L12 9.8 6.8 7.05 12 4.3Zm-6.5 4.4 5.5 2.9v7.45l-5.5-2.9V8.7Zm13 7.45-5.5 2.9V11.6l5.5-2.9v7.45Z"
      />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-zinc-300">
      <path
        fill="currentColor"
        d="M4 4h16l1 6a4 4 0 0 1-1 2.65V20H4v-7.35A4 4 0 0 1 3 10l1-6Zm2 9.88V18h12v-4.12A4 4 0 0 1 15 13a4 4 0 0 1-3-1.35A4 4 0 0 1 9 13a4 4 0 0 1-3-.12ZM5.7 6 5 10a2 2 0 1 0 4 0l.35-4H5.7Zm5.65 0L11 10a1 1 0 1 0 2 0l-.35-4h-1.3Zm3.3 0L15 10a2 2 0 1 0 4 0l-.7-4h-3.65Z"
      />
    </svg>
  )
}

function SummaryBlock({ data }: { data: SectionData }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-[#2d2d2d] p-5 shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#3a3a3a]">
          {data.icon}
        </span>
        <div>
          <p className="text-2xl font-bold text-white">
            <span className="mr-2">{data.count}</span>
            <span className="text-lg font-semibold text-zinc-300">{data.label}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 sm:shrink-0">
        <Link
          to={data.listTo}
          className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#697273]"
        >
          {data.listLabel}
        </Link>
        <Link
          to={data.newTo}
          className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#697273]"
        >
          {data.newLabel}
        </Link>
      </div>
    </article>
  )
}

function Home() {
  const { data: products, status } = useProducts()
  const loading = status === 'loading'
  const error = status === 'error'

  const categoryCount = new Set(
    products.map((p) => p.category || 'Sin categoria'),
  ).size

  const sections: SectionData[] = [
    {
      count: products.length,
      label: 'Productos',
      listTo: '/products',
      listLabel: 'Ver Listado',
      newTo: '/products/new',
      newLabel: 'Agregar Producto',
      icon: <BoxIcon />,
    },
    {
      count: categoryCount,
      label: 'Categorías',
      listTo: '/categories',
      listLabel: 'Ver Listado',
      newTo: '/categories/new',
      newLabel: 'Agregar Categoría',
      icon: <StoreIcon />,
    },
  ]

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-white">¡Hola {USERNAME}!</h1>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
          No se pudo conectar con la API. Verifica que esté ejecutándose en el puerto correcto.
        </div>
      ) : null}

      {loading ? (
        <p className="text-zinc-400">Cargando datos...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <SummaryBlock key={section.label} data={section} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Home
