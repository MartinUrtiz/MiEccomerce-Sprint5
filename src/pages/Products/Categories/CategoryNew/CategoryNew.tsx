import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCategory } from '../../../../hooks/useCategories'

function CategoryNew() {
  const navigate = useNavigate()
  const { createCategory, status: saveStatus, error: saveError } = useCreateCategory()

  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')

  function handleCancel() {
    setName('')
    setFormError('')
  }

  async function handleSave() {
    const trimmed = name.trim()

    if (!trimmed) {
      setFormError('El nombre es obligatorio.')
      return
    }

    setFormError('')

    try {
      await createCategory({ name: trimmed })
      navigate('/categories')
    } catch {
      // el error ya queda expuesto via saveError
    }
  }

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Agregar Categoría</h1>
        <p className="mt-1 text-sm text-zinc-400">Completa los datos de la nueva categoría</p>
      </header>

      <div className="flex flex-col gap-5 rounded-xl bg-[#2d2d2d] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white">Información</h2>

        {formError && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
            {formError}
          </div>
        )}
        {saveError && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
            {saveError}
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Nombre
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Electro, Indumentaria, ..."
            className="rounded-lg border border-zinc-600 bg-[#242424] px-3 py-2 text-white outline-none focus:border-zinc-400"
          />
        </label>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-[#3a3a3a]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'loading'}
            className="rounded-full bg-[#596162] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#697273] disabled:opacity-50"
          >
            {saveStatus === 'loading' ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default CategoryNew
