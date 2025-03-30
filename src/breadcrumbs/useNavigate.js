import { useCallback } from 'react'
import { useNavigate as useRouterNavigate } from 'react-router-dom'
import { useBreadcrumbs } from './BreadcrumbsProvider'

export function useNavigate() {
  const routerNavigate = useRouterNavigate()
  const { navigateWithBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs()

  // Standard navigate from react-router-dom that clears breadcrumbs
  const navigate = useCallback((path, options) => {
    clearBreadcrumbs()
    routerNavigate(path, options)
  }, [routerNavigate, clearBreadcrumbs])

  return {
    navigate,
    navigateWithBreadcrumbs,
  }
}
