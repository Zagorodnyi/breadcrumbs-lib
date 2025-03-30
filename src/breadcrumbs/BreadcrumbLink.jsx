import { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useBreadcrumbsInternal } from './BreadcrumbsProvider'

function BreadcrumbLink({ children, component, onClick, ...props}, ref) {
  const { pushBreadcrumbWithoutNav } = useBreadcrumbsInternal()
  const CustomLink = component || RouterLink
  return (
    <CustomLink
        ref={ref}
        to={props.to}
        onClick={() => {
          pushBreadcrumbWithoutNav(props.to)
          onClick?.()
        }}
        {...props}
    >
      {children}
    </CustomLink>
  )
}

export default forwardRef(BreadcrumbLink)
