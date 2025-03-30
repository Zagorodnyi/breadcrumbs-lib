import React, { createContext, useState, useEffect, useCallback, useContext, useLayoutEffect } from 'react'
import { useNavigate as useRouterNavigate, useLocation } from 'react-router-dom'

import ExtraStore from './ExtraStore'
import BreadcrumbItem from './BreadcrumbItem'
import { getTitleByPathname, serializeBreadcrumbs, deserializeBreadcrumbs } from './utils'

const BreadcrumbsContext = createContext(null)

export function BreadcrumbsProvider({ children, routesMap = () => void 0 }) {
  const location = useLocation()
  const routerNavigate = useRouterNavigate()

  const currentPath = `${location.pathname}${location.search}`

  const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumbs(currentPath, getTitleByPathname(currentPath, routesMap)))

  const _resetToIndex = useCallback(index => {
    setBreadcrumbs(prev => prev.slice(0, index + 1))
  }, [])

  const goToBreadcrumb = useCallback((index, { extra } = {}) => {
    if(index < 0) {
      // Convert negative index to positive. -1 because the last item is the current page
      index = breadcrumbs.length + (index - 1)
    }

    if(index < 0 || index >= breadcrumbs.length) {
      return false
    }
    const target = breadcrumbs[index]

    ExtraStore.setData(target.path, extra)
    _resetToIndex(index)
    routerNavigate(target.path)
    return true
  }, [breadcrumbs, routerNavigate, _resetToIndex])

  const navigateWithBreadcrumbs = useCallback((path, { clear, replace, extra = null, title } = {}) => {
    const existingIndex = breadcrumbs.findIndex(item => item.path === path)

    if(existingIndex !== -1) {
      goToBreadcrumb(existingIndex, { extra })
      return
    }

    ExtraStore.setData(path, extra)
    setBreadcrumbs(prev => {
      let newStack = [...prev]

      if(clear) {
        newStack = []
      }

      const newItem = new BreadcrumbItem({ path, title: title ?? getTitleByPathname(path, routesMap), state: {} })
      if(replace && newStack.length > 0) {
        newStack = [...newStack.slice(0, -1), newItem]
      } else {
        newStack = [...newStack, newItem]
      }

      return newStack
    })

    routerNavigate(path, { replace })
  }, [routerNavigate, breadcrumbs, goToBreadcrumb, routesMap])

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([new BreadcrumbItem({ path: currentPath,  title: getTitleByPathname(currentPath, routesMap), state: {} })])
  }, [currentPath, routesMap])

  /** *Internal function*. Updates the state of a breadcrumb item.Should not be used directly. */
  const updateBreadcrumbState = useCallback((path, state) => {
     const bc = breadcrumbs.find(item => item.path === path)
      if(bc) {
        bc.setState(state)
        return true
      }
      return false
  }, [breadcrumbs])

  /** *Internal Fn* Pushes breadcrumb into the stack without navigation */
  const pushBreadcrumbWithoutNav = useCallback((path, state = {}) => {
    setBreadcrumbs(prev => [ ...prev, new BreadcrumbItem({ path, title: getTitleByPathname(path, routesMap), state })])
  }, [routesMap])

  // SYNC
  useEffect(() => {
    sessionStorage.setItem('breadcrumbs', serializeBreadcrumbs(breadcrumbs))
  }, [breadcrumbs])

  // Global location change listener
  useLayoutEffect(() => {
    if(currentPath !== ExtraStore.targetPath) {
      ExtraStore.clear()
    }

    const bc = breadcrumbs.findIndex(i => i.path === currentPath)
    if(bc === -1) {
      clearBreadcrumbs()
      return
    }

    if(bc !== breadcrumbs.length - 1) {
      _resetToIndex(bc)
    }
  // eslint-disable-next-line
   }, [location])

  const contextValue = {
    breadcrumbs,
    navigateWithBreadcrumbs,
    goToBreadcrumb,
    clearBreadcrumbs,
    _internal: {
      updateBreadcrumbState,
      pushBreadcrumbWithoutNav,
    }
  }

  return (
    <BreadcrumbsContext.Provider value={contextValue}>
      {children}
    </BreadcrumbsContext.Provider>
  )
}

/**
* @typedef {Object} BreadcrumbsHook
* @property {BreadcrumbItem[]} breadcrumbs - The current breadcrumbs stack
* @property {NavigateWithBreadcrumbs} navigateWithBreadcrumbs - {@link NavigateWithBreadcrumbs}
* @property {GoToBreadcrumb} goToBreadcrumb - {@link GoToBreadcrumb}
* @property {ClearBreadcrumbs} clearBreadcrumbs - {@link ClearBreadcrumbs}
* @returns {BreadcrumbsHook}
*/
export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext)
  if(!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider')
  }

  const { _internal, ...ctx } = context
  return ctx
}

/** FOR INTERNAL USE IN LIBRARY */
export function useBreadcrumbsInternal() {
  const context = useContext(BreadcrumbsContext)
  if(!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider')
  }
  const { _internal, ...ctx } = context
  return { ...ctx, ..._internal }
}

function initBreadcrumbs(currentPath, currentTitle) {
  const stored = sessionStorage.getItem('breadcrumbs')

  if(stored) {
    const breadcrumbs = deserializeBreadcrumbs(stored)
    if(breadcrumbs.at(-1)?.path === currentPath) {
      return breadcrumbs
    }
  }
  return [new BreadcrumbItem({ path: currentPath, title: currentTitle, state: {} })]
}
