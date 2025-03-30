import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { BreadcrumbsProvider } from './breadcrumbs'

// Import pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import AdminPage from './pages/AdminPage'
import HiddenPage from './pages/HiddenPage'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <BreadcrumbsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/hidden" element={<HiddenPage />} />
        </Routes>
      </BreadcrumbsProvider>
    </BrowserRouter>
  )
}

export default App
