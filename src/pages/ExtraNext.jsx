// src/pages/HiddenPage.js
import React from 'react'
import Layout from '../components/Layout'
import { useBreadcrumbs, useNavigate, useExtra } from '../breadcrumbs'

function Extra() {
  const { goToBreadcrumb } = useBreadcrumbs()
  const extra = useExtra()
  const { navigateWithBreadcrumbs } = useNavigate()

  return (
    <Layout>
      <h2>Extra page</h2>

      <div style={{ marginTop: '20px' }}>
        <h3>Navigation Tests:</h3>

        {/* Go back without changing stack */}
          <button onClick={() => goToBreadcrumb(-1) || navigateWithBreadcrumbs('/')}>
            Go Back
          </button>

        {/* Navigate elsewhere with skip */}
          <button data-testid="buttonLink-contact" onClick={() => navigateWithBreadcrumbs('/contact')}>
            Go to Contact
          </button>
      </div>

      <div data-testid="extra-data">
        {typeof extra === 'object' ? (
          JSON.stringify(extra, null, 2)
        ) : (
          extra
        )}
      </div>
    </Layout>
  )
}

// Config for page
Extra.config = {
  url: '/extra-next',
  title: 'Extra Next Page'
}

export default Extra
