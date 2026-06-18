import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats, type DashboardStats } from '../../services/api'

function SummaryCard({
  title,
  value,
  to,
}: {
  title: string
  value: number | string
  to?: string
}) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl bg-[#2d2d2d] p-5 shadow-lg">
      <div>
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>

      {to ? (
        <Link
          to={to}
          className="rounded-full bg-[#596162] px-4 py-2 text-xs font-semibold text-white hover:bg-[#697273]"
        >
          Ver listado
        </Link>
      ) : null}
    </article>
  )
}

function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((reason: Error) => setError(reason.message))
  }, [])

  return (
    <section className="flex flex-col gap-8">
      <header>
        <p className="text-lg text-zinc-200">Hola Olivia!</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Resumen de la tienda</h1>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
          No se pudo conectar con la API de Sprint3. Verifica que este ejecutandose en el puerto 3001.
        </div>
      ) : null}

      {!stats && !error ? <p className="text-zinc-400">Cargando datos...</p> : null}

      {stats ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Productos" value={stats.summary.products} to="/productos" />
          <SummaryCard title="Usuarios" value={stats.summary.users} />
          <SummaryCard title="Ordenes" value={stats.summary.orders} />
          <SummaryCard
            title="Ingresos"
            value={stats.summary.revenue.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
            })}
          />
        </div>
      ) : null}
    </section>
  )
}

export default Home
