import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/productos', label: 'Productos', icon: 'box' },
  { to: '/categorias', label: 'Categorias', icon: 'store' },
]

function Icon({ name }: { name: string }) {
  if (name === 'box') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M12 2 3.5 6.5v11L12 22l8.5-4.5v-11L12 2Zm0 2.3 5.2 2.75L12 9.8 6.8 7.05 12 4.3Zm-6.5 4.4 5.5 2.9v7.45l-5.5-2.9V8.7Zm13 7.45-5.5 2.9V11.6l5.5-2.9v7.45Z"
        />
      </svg>
    )
  }

  if (name === 'store') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M4 4h16l1 6a4 4 0 0 1-1 2.65V20H4v-7.35A4 4 0 0 1 3 10l1-6Zm2 9.88V18h12v-4.12A4 4 0 0 1 15 13a4 4 0 0 1-3-1.35A4 4 0 0 1 9 13a4 4 0 0 1-3-.12ZM5.7 6 5 10a2 2 0 1 0 4 0l.35-4H5.7Zm5.65 0L11 10a1 1 0 1 0 2 0l-.35-4h-1.3Zm3.3 0L15 10a2 2 0 1 0 4 0l-.7-4h-3.65Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12 3 3 10.5l1.3 1.5L6 10.6V20h5v-6h2v6h5v-9.4l1.7 1.4 1.3-1.5L12 3Z"
      />
    </svg>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-[296px] shrink-0 flex-col bg-[#202020] px-5 py-6 text-white">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ec1b2e] text-xs font-black text-[#202020]">
          GT
        </span>
        Gestor Tienda
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-[#6d7474] text-white'
                  : 'text-zinc-300 hover:bg-zinc-700 hover:text-white',
              ].join(' ')
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 rounded-full bg-[#6d7a7a] px-2 py-1 text-xs text-white">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-[10px]">A</span>
        Admin
      </div>
    </aside>
  )
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-zinc-100">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Cerrar menu"
            className="fixed inset-0 z-30 bg-black/55 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={[
            'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:hidden',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        <main className="min-w-0 flex-1 bg-[#242424]">
          <div className="flex min-h-screen flex-col p-5 sm:p-6">
            <button
              type="button"
              aria-label="Abrir menu"
              className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-800 text-white shadow lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <span className="block h-0.5 w-5 bg-current before:relative before:-top-1.5 before:block before:h-0.5 before:bg-current after:relative after:top-1.5 after:block after:h-0.5 after:bg-current" />
            </button>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
