// src/pages/AdminPage.js
import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { useNavigate } from '../breadcrumbs'

function AdminPage() {
  const { navigateWithBreadcrumbs } = useNavigate()

  return (
    <Layout>
      <h2>Admin Page</h2>
      <p>This page demonstrates a section that resets breadcrumbs when accessed directly.</p>

      <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h3>Admin Section</h3>
        <p>This is a restricted area. Accessing this page directly will clear the breadcrumbs history.</p>
        <p>In a real application, this might be a secure section that requires authentication.</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Navigation Options:</h3>

        {/* Standard Link (will use regular navigate and reset breadcrumbs) */}
        <p>
          <Link to="/">Back to Home (using Link - will reset breadcrumbs)</Link>
        </p>

        {/* Programmatic navigation with breadcrumbs */}
        <p>
          <button onClick={() => navigateWithBreadcrumbs('/')}>
            Back to Home (preserving breadcrumbs)
          </button>
        </p>

        {/* Replace current breadcrumb */}
        <p>
          <button onClick={() => navigateWithBreadcrumbs('/products', { replace: true })}>
            Go to Products (replace breadcrumb)
          </button>
        </p>
      </div>
    </Layout>
  )
}

// Config for page
AdminPage.config = {
  url: '/admin',
  title: 'Admin page'
}

export default AdminPage
