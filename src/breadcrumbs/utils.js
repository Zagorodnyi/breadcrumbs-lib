import BreadcrumbItem from './BreadcrumbItem'

/**
 * Gets the title for a given pathname
 * @param {string} pathname - The full pathname from window.location.pathname + window.location.search
 * @param {Object} routesMap - A map of route paths to their titles
 * @returns {string|null} - The title of the page or null if not found
 */
export function getTitleByPathname(pathname = '', routesMap) {
  const pathWithoutSearch = pathname.split('?')[0];

  const exactMatch = routesMap[pathWithoutSearch];
  if (exactMatch) {
    return exactMatch.title;
  }

  for (const { regex, title } of Object.values(routesMap)) {
    if (regex && regex.test(pathWithoutSearch)) {
      return title;
    }
  }

  return null;
}


export const serializeBreadcrumbs = breadcrumbs => {
  return JSON.stringify(breadcrumbs)
}

export const deserializeBreadcrumbs = json => {
  try {
    const parsed = JSON.parse(json)
    return parsed.map(item => new BreadcrumbItem(item))
  } catch (e) {
    console.error('Error deserializing breadcrumbs:', e)
    return []
  }
}

export function pathToRegex(path) {
  const pattern = path
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\//g, '\\/')
  return new RegExp(`^${pattern}$`)
}
