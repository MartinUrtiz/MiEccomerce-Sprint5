function Profile() {
  return (
    <section className="flex max-w-3xl flex-col gap-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-zinc-500">Perfil</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Usuario</h1>
      </header>

      <article className="rounded-xl bg-[#2d2d2d] p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-zinc-900 text-lg font-semibold text-white">
            U
          </span>
          <div>
            <p className="text-lg font-semibold text-white">Usuario</p>
            <p className="text-sm text-zinc-400">Administradora de la tienda</p>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Profile
