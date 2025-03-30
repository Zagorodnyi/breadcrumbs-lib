// src/components/Layout.js
import React from 'react'
import { Link } from 'react-router-dom'
import BreadcrumbsDisplay from './BreadcrumbsDisplay'
import { useBreadcrumbs, useNavigate } from '../breadcrumbs'

export default function Layout({ children }) {
  const { clearBreadcrumbs } = useBreadcrumbs()
  const { navigate, navigateWithBreadcrumbs } = useNavigate()

  // Direct navigation that resets breadcrumbs
  const handleAdminClick = () => {
    navigate('/admin')
  }

  // Navigation with breadcrumbs
  const handleContactClick = () => {
    navigateWithBreadcrumbs('/contact')
  }

  // Navigation with skip option
  const handleHiddenClick = () => {
    navigateWithBreadcrumbs('/hidden')
  }

  return (
    <div className="app-container">
      <header>
        <h1>Breadcrumbs Test App</h1>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
            {/* Standard Link component - will reset breadcrumbs */}
            <li><Link to="/">Home</Link></li>

            {/* Link that preserves breadcrumbs */}
            <li>
              <Link to="/products"
                onClick={(e) => {
                  e.preventDefault()
                  navigateWithBreadcrumbs('/products')
                }}>
                Products
              </Link>
            </li>

            {/* Button with programmatic navigation */}
            <li><button onClick={handleContactClick}>Contact</button></li>

            {/* Button that resets breadcrumbs */}
            <li><button onClick={handleAdminClick}>Admin</button></li>

            {/* Button with skip option */}
            <li><button onClick={handleHiddenClick}>Hidden Page</button></li>

            {/* Button to clear breadcrumbs */}
            <li><button onClick={clearBreadcrumbs}>Clear Breadcrumbs</button></li>
          </ul>
        </nav>
      </header>

      <div className="breadcrumbs-container" style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <BreadcrumbsDisplay />
      </div>

      <main style={{ padding: '20px' }}>
        {children}
      </main>

    </div>
  )
}
