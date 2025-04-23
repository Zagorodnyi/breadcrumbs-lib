import { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useBreadcrumbs } from './BreadcrumbsProvider'

export function useBreadcrumbState(key, initialState) {
  const { breadcrumbs } = useBreadcrumbs()
  const location = useLocation()
  const currentPath = `${location.pathname}${location.search}`

  const currentBreadcrumb = useMemo(
    () => breadcrumbs.find(item => item.path === currentPath),
    [breadcrumbs, currentPath],
  )
  const [state, setState] = useState(currentBreadcrumb?.state?.[key] ?? initialState)

  const setBreadcrumbState = useCallback(newStateOrFn => {
    setState(prevState => {
      const nextState = typeof newStateOrFn === 'function'
        ? newStateOrFn(prevState)
        : newStateOrFn

      currentBreadcrumb.setState({
        ...currentBreadcrumb.state,
        [key]: nextState,
      })

      return nextState
    })
  }, [currentBreadcrumb, key])

  return [state, setBreadcrumbState]
}
