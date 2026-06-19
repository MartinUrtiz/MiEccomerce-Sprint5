import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/home', label: 'Inicio', icon: 'home', end: true },
  { to: '/products', label: 'Productos', icon: 'box' },
  { to: '/categories', label: 'Categorias', icon: 'store' },
]

function Icon({ name }: { name: string }) {
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        />
      </svg>
    )
  }

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
      <div className="mb-10 flex items-center gap-3 text-2xl font-bold text-[#ff1f32]">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ff1f32] text-sm font-black text-[#202020]">
          S
        </span>
        Santander
      </div>

      <nav className="flex flex-col gap-2" aria-label="Menu principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
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

      <NavLink
        to="/profile"
        onClick={onNavigate}
        className={({ isActive }) =>
          [
            'mt-auto flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium text-white transition',
            isActive ? 'bg-[#788383]' : 'bg-[#566061] hover:bg-[#667071]',
          ].join(' ')
        }
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-zinc-900">
          <Icon name="user" />
        </span>
        Olivia
      </NavLink>
    </aside>
  )
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/products')) return 'Productos'
  if (pathname.startsWith('/categories')) return 'Categorias'
  if (pathname.startsWith('/profile')) return 'Perfil'
  return 'Inicio'
}

function Header({ onOpenSidebar, title }: { onOpenSidebar: () => void; title: string }) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-800 bg-[#242424] px-5 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-white shadow min-[1025px]:hidden"
          onClick={onOpenSidebar}
        >
          <span className="sr-only">Abrir menu</span>
          <span className="block h-0.5 w-5 bg-current before:relative before:-top-1.5 before:block before:h-0.5 before:bg-current after:relative after:top-1.5 after:block after:h-0.5 after:bg-current" />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
        </div>
      </div>
    </header>
  )
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  return (
    <div className="h-screen overflow-hidden bg-[#1c1c1c] text-zinc-100">
      <div className="flex h-screen">
        <div className="hidden min-[1025px]:block">
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Cerrar menu"
            className="fixed inset-0 z-30 bg-black/55 min-[1025px]:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={[
            'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 min-[1025px]:hidden',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        <main className="flex h-screen min-w-0 flex-1 flex-col bg-[#242424]">
          <Header title={title} onOpenSidebar={() => setIsSidebarOpen(true)} />
          <section className="h-[calc(100vh-72px)] overflow-y-auto p-5 sm:p-6">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
