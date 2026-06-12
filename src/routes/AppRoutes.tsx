import { Routes, Route } from 'react-router-dom'
import AppLayout from '../components/AppLayout/AppLayout'
import Home from '../pages/Home/Home'
import ProductsList from '../pages/Products/ProductsList/ProductsList'
import ProductView from '../pages/Products/ProductView/ProductView'
import CategoriesList from '../pages/Products/Categories/CategoriesList/CategoriesList'
import CategoryView from '../pages/Products/Categories/CategoryView/CategoryView'
import NotFound from '../pages/NotFound/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/productos" element={<ProductsList />} />
        <Route path="/productos/:id" element={<ProductView />} />

        <Route path="/categorias" element={<CategoriesList />} />
        <Route path="/categorias/:id" element={<CategoryView />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes