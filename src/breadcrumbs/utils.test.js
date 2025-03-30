import { test, expect, describe } from 'vitest'
import '@testing-library/jest-dom/vitest';

import { getTitleByPathname } from './utils';

/**
 * Configuration for pages with their paths and titles
 * Static paths are stored as direct key-value pairs
 * Dynamic paths are converted to regex patterns for efficient matching
 */
const routesMap = {
  '/dashboard': { title: 'Dashboard', regex: null },
  '/users': { title: 'Users List', regex: null },
  '/products': { title: 'Products Catalog', regex: null },
  '/settings': { title: 'Settings', regex: null },
  '/users/:id': { regex: /^\/users\/[^/]+$/, title: 'User Details' },
  '/products/:id': { regex: /^\/products\/[^/]+$/, title: 'Product Details' },
  '/reports/:type/:year': { regex: /^\/reports\/[^/]+\/[^/]+$/, title: 'Annual Report' },
};


// For testing:
//
  const testCases = [
  { path: '/dashboard', expected: 'Dashboard' },
  { path: '/users', expected: 'Users List' },
  { path: '/users/123', expected: 'User Details' },
  { path: '/products', expected: 'Products Catalog' },
  { path: '/products/abc', expected: 'Product Details' },
  { path: '/settings', expected: 'Settings' },
  { path: '/reports/sales/2023', expected: 'Annual Report' },
  { path: '/dashboard?tab=overview', expected: 'Dashboard' },
  { path: '/users/123?view=details', expected: 'User Details' },
  { path: '/unknown', expected: null },
]

describe('#getTitleByPathname', () => {
  testCases.forEach(t => {
    test(t.path, () => {
      const result = getTitleByPathname(t.path, routesMap);
      expect(result).toBe(t.expected);
    })
  });

})
