import React from 'react'
import Layout from '../components/Layout'
import { useNavigate, BreadcrumbLink } from '../breadcrumbs'

function Home() {
  const { navigateWithBreadcrumbs } = useNavigate()

  return (
    <Layout>
      <h2 data-testid="home-page">Home Page</h2>

      <div style={{ marginTop: '20px' }}>
        <h3>Navigation Tests:</h3>
        <ul>
          <li>
            <button data-testid="buttonLink-products" onClick={() => navigateWithBreadcrumbs('/products')}>
              Go to Products (with breadcrumb)
            </button>
          </li>
          <li>
            <BreadcrumbLink to="/products" data-testid="link-products">
              Go to Products (Custom Link)
            </BreadcrumbLink>
          </li>
          <li>
            <button data-testid="buttonLink-contact-replace" onClick={() => navigateWithBreadcrumbs('/contact', { replace: true })}>
              Go to Contact (replace breadcrumb)
            </button>
          </li>
          <li>
            <button data-testid="buttonLink-admin-clear" onClick={() => navigateWithBreadcrumbs('/admin', { clear: true })}>
              Go to Admin (clear all breadcrumbs)
            </button>
          </li>
          <li>
            <button data-testid="buttonLink-extra" onClick={() => navigateWithBreadcrumbs('/extra', { extra: { foo: 'bar' } })}>
              Go to Extra (with object)
            </button>
          </li>
          <li>
            <button data-testid="buttonLink-productDetails" onClick={() => navigateWithBreadcrumbs('/products/1', { title: 'Product 1' })}>
              Go to Product (with custom title)
            </button>
          </li>
        </ul>
      </div>
    </Layout>
  )
}

// Config for page
Home.config = {
  url: '/',
  title: 'Home'
}

export default Home
