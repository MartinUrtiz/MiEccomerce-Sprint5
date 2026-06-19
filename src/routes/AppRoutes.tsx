import { Navigate, Routes, Route } from 'react-router-dom'
import AppLayout from '../components/AppLayout/AppLayout'
import Home from '../pages/Home/Home'
import ProductsList from '../pages/Products/ProductsList/ProductsList'
import ProductView from '../pages/Products/ProductView/ProductView'
import CategoriesList from '../pages/Products/Categories/CategoriesList/CategoriesList'
import CategoryView from '../pages/Products/Categories/CategoryView/CategoryView'
import Profile from '../pages/Profile/Profile'
import NotFound from '../pages/NotFound/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductView />} />

        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/:id" element={<CategoryView />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/productos" element={<Navigate to="/products" replace />} />
        <Route path="/productos/:id" element={<ProductView />} />
        <Route path="/categorias" element={<Navigate to="/categories" replace />} />
        <Route path="/categorias/:id" element={<CategoryView />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
