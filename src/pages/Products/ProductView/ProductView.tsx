import { useParams } from 'react-router-dom'

function ProductView() {
  const { id } = useParams()

  return (
    <section>
      <h1>Detalle del producto</h1>
      <p>ID: {id}</p>
    </section>
  )
}

export default ProductView