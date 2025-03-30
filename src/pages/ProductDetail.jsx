// src/pages/ProductDetail.js
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useBreadcrumbs, useNavigate } from '../breadcrumbs'

// Sample product data
const productsData = {
  '1': { id: 1, name: 'Laptop', description: 'A powerful laptop for all your needs', category: 'Electronics', price: 999.99 },
  '2': { id: 2, name: 'Headphones', description: 'High-quality noise-cancelling headphones', category: 'Electronics', price: 149.99 },
  '3': { id: 3, name: 'Coffee Mug', description: 'A stylish coffee mug for your morning caffeine', category: 'Kitchen', price: 12.99 },
  '4': { id: 4, name: 'Book', description: 'Bestseller novel that you won\'t be able to put down', category: 'Books', price: 19.99 },
  '5': { id: 5, name: 'Smartphone', description: 'Latest smartphone with advanced features', category: 'Electronics', price: 799.99 },
}

function ProductDetail() {
  const { productId } = useParams()
  const { goToBreadcrumb } = useBreadcrumbs()
  const { navigateWithBreadcrumbs, navigate } = useNavigate()

  // Get product data from our "database"
  const product = productsData[productId]

  if (!product) {
    return (
      <Layout>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button data-testid="go-back" onClick={() => goToBreadcrumb(-1) || navigateWithBreadcrumbs('/products')}>
          Back to Products
        </button>
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 data-testid="product-details-page">Product: {product.name}</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
          <h3>{product.name}</h3>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Description:</strong> {product.description}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button data-testid="go-back" onClick={() => goToBreadcrumb(-1) || navigate('/')}>
          Back
        </button>

        <Link data-testid="link-products-raw" to="/products">
          Back to products Raw
        </Link>

        <Link data-testid="link-admin-raw" to="/admin">
          Admin (Clear History)
        </Link>

      </div>
    </Layout>
  )
}

// Dynamic config for page
ProductDetail.config = {
  url: `/products/:productId`,
  title: 'Product Detail',
}

export default ProductDetail
