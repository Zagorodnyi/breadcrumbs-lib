import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useBreadcrumbs } from './BreadcrumbsProvider'

export function useBreadcrumbsState(initialState) {
  const { breadcrumbs } = useBreadcrumbs()
  const location = useLocation()
  const [state, setState] = useState(initialState)
  const currentPath = `${location.pathname}${location.search}`

  const currentBreadcrumb = breadcrumbs.find(item => item.path === currentPath)

  const initializedRef = useRef(false)

  useEffect(() => {
    if(!initializedRef.current && currentBreadcrumb && Object.keys(currentBreadcrumb.state).length > 0) {
      setState(currentBreadcrumb.state)
      initializedRef.current = true
    }
  }, [currentBreadcrumb])

  const setBreadcrumbState = useCallback(newStateOrFn => {
    setState(prevState => {
      const nextState = typeof newStateOrFn === 'function'
        ? newStateOrFn(prevState)
        : newStateOrFn

      currentBreadcrumb.setState(nextState)

      return nextState
    })
  }, [currentBreadcrumb])

  return [state, setBreadcrumbState]
}
