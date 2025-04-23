import { ReactNode, ComponentType, RefAttributes } from "react";
import { LinkProps } from "react-router-dom";

/**
 * Represents a breadcrumb item in the navigation stack
 */
export class BreadcrumbItem {
  constructor(options: { path: string; title: string; state?: object });

  /**
   * The route path
   */
  get path(): string;

  /**
   * The breadcrumb state object
   */
  get state(): unknown;

  /**
   * The display title of the breadcrumb
   */
  get title(): string;

  /**
   * Update the state of the breadcrumb
   */
  setState(state: object): void;

  /**
   * Navigate to this breadcrumb's path
   * @returns True if navigation succeeded
   *
   * @example
   * ```tsx
   * <button onClick={() => breadcrumbItem.navigate()}>
   *   Go to {breadcrumbItem.title}
   * </button>
   * ```
   */
  navigate(): boolean;
}

/**
 * Extra data passed between routes
 */
export interface Extra {
  [key: string]: any;
}

/**
 * Options for navigating with breadcrumbs
 */
export interface NavigateWithBreadcrumbsOptions {
  /**
   * Clear breadcrumbs. Makes the target route first in the stack
   */
  clear?: boolean;

  /**
   * Replace the last breadcrumb with the new one
   */
  replace?: boolean;

  /**
   * Extra data to be passed to the target route
   */
  extra?: any;

  /**
   * Custom title for the breadcrumb (overrides routesMap)
   */
  title?: string;
}

/**
 * Options for going to a breadcrumb
 */
export interface GoToBreadcrumbOptions {
  /**
   * Extra data to be passed to the target route
   */
  extra?: any;
}

/**
 * Navigates to a path and adds it to the breadcrumbs stack.
 *
 * @example
 * ```tsx
 * navigateWithBreadcrumbs('/users/123', {
 *   title: 'John Doe Profile',
 *   extra: { userId: 123 }
 * });
 * ```
 */
export type NavigateWithBreadcrumbs = (path: string, options?: NavigateWithBreadcrumbsOptions) => void;

/**
 * Navigate to a specific breadcrumb by index
 * @returns True if navigation succeeded
 * @example
 * ```tsx
 * // Go to the 2nd breadcrumb in the stack
 * goToBreadcrumb(1);
 *
 * // Go back one breadcrumb
 * goToBreadcrumb(-1);
 *
 * // Go to first breadcrumb with extra data
 * goToBreadcrumb(0, { extra: { highlight: true } });
 * ```
 */
export type GoToBreadcrumb = (index: number, options?: GoToBreadcrumbOptions) => boolean;

/**
 * Clears all breadcrumbs and sets the current page as the first item
 */
export type ClearBreadcrumbs = () => void;

/**
 * Route map definition for obtaining titles
 * @example
 * ```tsx
 * const routesMap = {
 *   '/dashboard': { title: 'Dashboard' },
 *   '/users': { title: 'Users List' },
 *   '/users/:id': {
 *     title: 'User Details',
 *     regex: pathToRegex('/users/:id')
 *   }
 * };
 * ```
 */
export interface RoutesMap {
  [path: string]: {
    title: string;
    regex?: RegExp | null;
  };
}

/**
 * Return type of the useBreadcrumbs hook
 */
export interface BreadcrumbsHook {
  /**
   * The current breadcrumbs stack. Current page is the last item
   */
  breadcrumbs: BreadcrumbItem[];

  /**
   * Navigate to a path with breadcrumb support
   */
  navigateWithBreadcrumbs: NavigateWithBreadcrumbs;

  /**
   * Go to a specific breadcrumb by index
   */
  goToBreadcrumb: GoToBreadcrumb;

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs: ClearBreadcrumbs;
}

/**
 * Props for the BreadcrumbsProvider component
 */
export interface BreadcrumbsProviderProps {
  children: ReactNode;
  /**
   * Map of routes to their titles
   */
  routesMap: RoutesMap;
}

/**
 * Provider component for breadcrumbs functionality
 *
 * @example
 * ```tsx
 * // App.tsx
 * import { BreadcrumbsProvider } from 'lib/breadcrumbs';
 *
 * const routesMap = {
 *   '/dashboard': { title: 'Dashboard' },
 *   '/users': { title: 'Users List' },
 *   '/settings': { title: 'Settings' }
 * };
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <BreadcrumbsProvider routesMap={routesMap}>
 *         <Routes>
 *           <Route path="/dashboard" element={<Dashboard />} />
 *           <Route path="/users" element={<Users />} />
 *           <Route path="/settings" element={<Settings />} />
 *         </Routes>
 *       </BreadcrumbsProvider>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 */
export const BreadcrumbsProvider: ComponentType<BreadcrumbsProviderProps>;

/**
 * Hook to access breadcrumbs functionality
 *
 * @example
 * ```tsx
 * import { useBreadcrumbs } from 'lib/breadcrumbs';
 *
 * function BreadcrumbsNavigation() {
 *   const { breadcrumbs, goToBreadcrumb } = useBreadcrumbs();
 *
 *   return (
 *     <nav aria-label="breadcrumbs">
 *       <button onClick={() => goToBreadcrumb(-1)}>Go back</button>
 *       <ul>
 *         {breadcrumbs.map((crumb, index) => (
 *           <li key={crumb.path}>
 *             <button onClick={() => crumb.navigate()}>
 *               {crumb.title}
 *             </button>
 *           </li>
 *         ))}
 *       </ul>
 *     </nav>
 *   );
 * }
 * ```
 */
export function useBreadcrumbs(): BreadcrumbsHook;

/**
 * Hook to manage state that persists in breadcrumb navigation. Behaves like useState. Automatically stores and restores state when navigating.
 * @param initialState Initial state value
 * @returns [state, setState] tuple similar to useState
 * @example
 * ```tsx
 * import { useBreadcrumbState } from 'lib/breadcrumbs';
 *
 * function UserFilters() {
 *   // State persists when navigating away and back
 *   const [filters, setFilters] = useBreadcrumbState('filters', {
 *     searchTerm: '',
 *     sortBy: 'name'
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={filters.searchTerm}
 *         onChange={e => setFilters({
 *           ...filters,
 *           searchTerm: e.target.value
 *         })}
 *       />
 *       <select
 *         value={filters.sortBy}
 *         onChange={e => setFilters({
 *           ...filters,
 *           sortBy: e.target.value
 *         })}
 *       >
 *         <option value="name">Name</option>
 *         <option value="date">Date</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBreadcrumbState<T>(key: string, initialState?: T): [T, (newState: T | ((prevState: T) => T)) => void];

/**
 * Return type of useNavigate hook
 */
export interface UseNavigateReturn {
  /**
   * Standard navigate function that clears breadcrumbs
   */
  navigate: (path: string, options?: { replace?: boolean }) => void;

  /**
   * Navigate while maintaining breadcrumbs
   */
  navigateWithBreadcrumbs: NavigateWithBreadcrumbs;
}

/**
 * Hook to get navigation functions
 * @example
 * ```tsx
 * import { useNavigate } from 'lib/breadcrumbs';
 *
 * function Navigation() {
 *   const { navigate, navigateWithBreadcrumbs } = useNavigate();
 *
 *   return (
 *     <div>
 *       {/* Regular navigation, clears breadcrumbs history *\/}
 *       <button onClick={() => navigate('/dashboard')}>
 *         Dashboard (reset breadcrumbs)
 *       </button>
 *
 *       {/* Breadcrumb-aware navigation *\/}
 *       <button
 *         onClick={() => navigateWithBreadcrumbs('/users/123', {
 *           title: 'John Doe',
 *           replace: true,
 *         })}
 *       >
 *         View User Detail
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNavigate(): UseNavigateReturn;

/**
 * Hook to access extra data passed from the previous route.
 * Returns the `extra` passed to navigation function as plain javascript value.
 * **NOT REACTIVE**
 * @example
 * ```tsx
 * import { useExtra } from 'lib/breadcrumbs';
 *
 * function UserDetails() {
 *   // Get the extra data passed during navigation
 *   const extraData = useExtra();
 *
 *   useEffect(() => {
 *     if (extraData?.userId) {
 *       // Load user data with the ID from extra
 *       fetchUserData(extraData.userId);
 *     }
 *   }, [extraData]);
 *
 *   return (
 *     // Component JSX
 *   );
 * }
 * ```
 */
export function useExtra<T = string | number | object>(): T | null;

/**
 * Props for the Link component
 */
export interface BreadcrumbLinkProps extends Omit<LinkProps, "component"> {
  /**
   * Override the default Link component
   */
  component?: ComponentType<any>;
  children: ReactNode;
}

/**
 * BreadcrumbLink component that integrates with breadcrumbs
 *
 * @example
 * ```tsx
 * import { BreadcrumbLink } from 'lib/breadcrumbs';
 *
 * function Navigation() {
 *   return (
 *     <nav>
 *       <ul>
 *         <li>
 *           <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
 *         </li>
 *         <li>
 *           <BreadcrumbLink to="/users">Users</BreadcrumbLink>
 *         </li>
 *         <li>
 *           <BreadcrumbLink to="/settings">Settings</BreadcrumbLink>
 *         </li>
 *       </ul>
 *     </nav>
 *   );
 * }
 * ```
 */
export const BreadcrumbLink: ComponentType<BreadcrumbLinkProps & RefAttributes<HTMLAnchorElement>>;

/**
 * Utility to convert path pattern to regex
 *
 * @example
 * ```tsx
 * const regex = pathToRegex('/users/:id');
 * console.log(regex.test('/users/123')); // true
 * console.log(regex.test('/users/abc')); // true
 * console.log(regex.test('/users')); // false
 * ```
 */
export function pathToRegex(path: string): RegExp;
