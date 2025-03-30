// src/components/BreadcrumbsDisplay.js
import React from 'react'
import { useBreadcrumbs } from '../breadcrumbs'

export default function BreadcrumbsDisplay() {
  const { breadcrumbs, goToBreadcrumb } = useBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return <div>No breadcrumbs history</div>
  }

  return (
    <div style={{  background: "#000" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', }}>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => goToBreadcrumb(index)}
              style={{
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#0066cc',
                textDecoration: 'underline',
                padding: '2px'
              }}
            >
              {crumb.path}
            </button>
            {index < breadcrumbs.length - 1 && <span>|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Debug info */}
      <div data-testid="breadcrumbs-res">{JSON.stringify(breadcrumbs)}</div>
    </div>
  )
}
