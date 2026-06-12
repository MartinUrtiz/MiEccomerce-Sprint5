import { useParams } from 'react-router-dom'

function CategoryView() {
  const { id } = useParams()

  return (
    <section>
      <h1>Detalle de categoría</h1>
      <p>ID: {id}</p>
    </section>
  )
}

export default CategoryView