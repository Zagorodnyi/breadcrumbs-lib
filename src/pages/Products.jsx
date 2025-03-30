// src/pages/Products.js
import React from 'react'
import Layout from '../components/Layout'
import { useBreadcrumbsState, useBreadcrumbs, useNavigate, BreadcrumbLink } from '../breadcrumbs'

// Sample product data
const productsList = [
  { id: 1, name: 'Laptop', category: 'Electronics' },
  { id: 2, name: 'Headphones', category: 'Electronics' },
  { id: 3, name: 'Coffee Mug', category: 'Kitchen' },
  { id: 4, name: 'Book', category: 'Books' },
  { id: 5, name: 'Smartphone', category: 'Electronics' },
]

function Products() {
  const { goToBreadcrumb } = useBreadcrumbs()
  const { navigate } = useNavigate()
  // Use breadcrumbs state to save filter values
  const [state, setState] = useBreadcrumbsState({
    searchTerm: '',
    selectedCategory: '',
  })

  // Filter products based on state
  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    const matchesCategory = state.selectedCategory === '' || product.category === state.selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle input changes
  const handleSearchChange = (e) => {
    setState({
      ...state,
      searchTerm: e.target.value
    })
  }

  const handleCategoryChange = (e) => {
    setState({
      ...state,
      selectedCategory: e.target.value
    })
  }

  return (
    <Layout>
      <h2 data-testid="products-page">Products Page</h2>
      <p>This page demonstrates state preservation with breadcrumbs.</p>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>
            Search:
            <input
              data-testid="search-input"
              type="text"
              value={state.searchTerm}
              onChange={handleSearchChange}
              style={{ marginLeft: '5px', padding: '5px' }}
            />
          </label>
        </div>

        <div>
          <label style={{ marginRight: '10px' }}>
            Filter by Category:
            <select
              value={state.selectedCategory}
              onChange={handleCategoryChange}
              style={{ marginLeft: '5px', padding: '5px' }}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Books">Books</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <h3>Product List</h3>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul>
            {filteredProducts.map(product => (
              <li key={product.id} style={{ marginBottom: '8px' }}>
                <BreadcrumbLink
                  data-testid={`link-product${product.id}`}
                  to={`/products/${product.id}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  {product.name}
                </BreadcrumbLink> - {product.category}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <p>
          <strong>Note:</strong> When you navigate away and come back to this page,
          your search and filter settings should be preserved thanks to breadcrumbs state.
        </p>
      </div>

      <BreadcrumbLink to="/contact" data-testid="link-contacts-raw">
        Go to contacts
      </BreadcrumbLink>
      <button data-testid="go-non-existing" onClick={() => goToBreadcrumb(10) || navigate('/contact?fallback=true')}>
        Non existing. Defaults to contacts
      </button>
    </Layout>
  )
}

// Config for page
Products.config = {
  url: '/products',
  title: 'Products'
}

export default Products
