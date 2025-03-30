// src/pages/HiddenPage.js
import React from 'react'
import Layout from '../components/Layout'
import { useBreadcrumbs, useNavigate } from '../breadcrumbs'

function HiddenPage() {
  const { goToBreadcrumb } = useBreadcrumbs()
  const { navigateWithBreadcrumbs } = useNavigate()

  return (
    <Layout>
      <h2>Hidden Page</h2>
      <p>This page demonstrates the "skip" option. It doesn't appear in breadcrumbs history.</p>

      <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h3>Skip Option Demonstration</h3>
        <p>
          When you navigated to this page, the breadcrumbs history was not updated.
          This is useful for temporary pages, modals, or pages that shouldn't be part of the main navigation flow.
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Navigation Tests:</h3>

        {/* Go back without changing stack */}
        <p>
          <button onClick={() => goToBreadcrumb(-1) || navigateWithBreadcrumbs('/')}>
            Go Back (preserve stack)
          </button>
        </p>

        {/* Add to breadcrumbs (now it will be added) */}
        <p>
          <button onClick={() => navigateWithBreadcrumbs('/hidden')}>
            Refresh Page (add to breadcrumbs this time)
          </button>
        </p>

        {/* Navigate elsewhere with skip */}
        <p>
          <button onClick={() => navigateWithBreadcrumbs('/contact', { replace: true })}>
            Go to Contact
          </button>
        </p>
      </div>
    </Layout>
  )
}

// Config for page
HiddenPage.config = {
  url: '/hidden',
  title: 'Hidden Page'
}

export default HiddenPage
