import App from './App';
import * as pages from './pages'

import { BreadcrumbsProvider } from './breadcrumbs'
import { pathToRegex } from './breadcrumbs/utils'

import { userEvent } from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { test, expect, beforeEach, describe, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest';

const routesMap = {}
const routes = initRoutes(routesMap)

const { ProductDetail, HomePage, AdminPage, Products, Contact } = pages

/**
*  TESTS
*/

describe('General logic', () => {
  afterEach(cleanup)

  test('Rendered page is the first page in breadcrumbs stack', () => {
    render(<App />)
    const breadcrumbs = getBreadcrumbState()

    expect(breadcrumbs).toHaveLength(1)
    expect(breadcrumbs[0].path).toBe(HomePage.config.url)
  })

  test('Click on custom Link adds entry to breadcrumbs stack', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('link-products'));
    await user.click(screen.getByTestId('link-product1'));

    const newBreadcrumbs = getBreadcrumbState();
    expect(newBreadcrumbs).toHaveLength(3);
    expect(newBreadcrumbs[newBreadcrumbs.length - 1].path).toBe('/products/1');
  });

  test('Not using custom functions results in stack clearing', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('link-products'))
    await user.click(screen.getByTestId('link-product1'));

    await waitFor(() => {
      const breadcrumbs = getBreadcrumbState();
      expect(breadcrumbs).toHaveLength(3);
    })

    await user.click(screen.getByTestId('link-admin-raw'));
    const newBreadcrumbs = getBreadcrumbState();

    expect(newBreadcrumbs).toHaveLength(1);
    expect(newBreadcrumbs[0].path).toBe(AdminPage.config.url);
  })

  test('Using raw `Link` or `navigate` for the existing route in stack resets it to the index', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('link-products'))
    await user.click(screen.getByTestId('link-product1'));
    await user.click(screen.getByTestId('link-products-raw'));

    const breadcrumbsState = getBreadcrumbState();
    expect(breadcrumbsState).toHaveLength(2);
    expect(breadcrumbsState.at(-1).path).toBe(Products.config.url);
  })

  test('Expect correct title from Page.config', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);

    const breadcrumbsState = getBreadcrumbState();
    expect(breadcrumbsState[0].title).toEqual(HomePage.config.title)
  })
})

describe('#navigateWithBreadcrumbs()', () => {
  beforeEach(() => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
  })

  afterEach(cleanup)

  test('Adds entry to breadcrumbs stack', async () => {
    await userEvent.click(screen.getByTestId('buttonLink-products'))

    const newBreadcrumbs = getBreadcrumbState()

    expect(newBreadcrumbs).toHaveLength(2)
    expect(newBreadcrumbs.at(-1).path).toBe(Products.config.url)
  })

  test('Replace should work', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('buttonLink-contact-replace'))

    const breadcrumbsState = getBreadcrumbState();
    expect(breadcrumbsState).toHaveLength(1);
    expect(breadcrumbsState.at(-1).path).toBe(Contact.config.url);
  })

  test('Default title should be from routesMap', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('link-products'))
    await user.click(screen.getByTestId('link-product1'))
    const breadcrumbsState = getBreadcrumbState();

    expect(breadcrumbsState.at(-1).title).toEqual(ProductDetail.config.title)
  })

  test('Title parameter should override default title for target', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('buttonLink-productDetails'))
    const breadcrumbsState = getBreadcrumbState();

    expect(breadcrumbsState.at(-1).title).toEqual('Product 1')
  })
})

describe('#goToBreadcrumb()', () => {
  afterEach(cleanup)

  test('Call with -1 should pop entry from stack', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('link-products'))
    await user.click(screen.getByTestId('link-product1'));
    await user.click(screen.getByTestId('go-back'));

    const breadcrumbsState = getBreadcrumbState();
    expect(breadcrumbsState).toHaveLength(2);
    expect(breadcrumbsState.at(-1).path).toBe(Products.config.url);
  })

  test('Call with -1 should return `false` if only one element in stack', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/products/1'], initialIndex: 0 })} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('go-back'));

    const breadcrumbsState = getBreadcrumbState();
    expect(breadcrumbsState).toHaveLength(1);
    expect(breadcrumbsState.at(-1).path).toBe(HomePage.config.url);
  })

  test('Going to non existing index should return `false`', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/products'], initialIndex: 0 })} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('go-non-existing'));

    const breadcrumbsState = getBreadcrumbState();
    expect(breadcrumbsState).toHaveLength(1);
    expect(breadcrumbsState.at(-1).path).toBe(`${Contact.config.url}?fallback=true`);
  })
})


describe('#useBreadcrumbState()', () => {
  beforeEach(() => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
  })

  afterEach(cleanup)

  test('Persist state when navigating back in stack', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('buttonLink-contact-replace'))
    await user.type(screen.getByTestId('name-input'), 'John Doe')
    await user.type(screen.getByTestId('email-input'), 'email@gmail.com')

    await user.click(screen.getByTestId('buttonLink-products'))
    await waitFor(async () => {
      await user.click(screen.getByTestId('link-contacts-raw'))
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
    })

    const nameInput = screen.getByTestId('name-input')
    const emailInput = screen.getByTestId('email-input')

    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('email@gmail.com')
  })
})

describe('extra', () => {
  beforeEach(() => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })} />);
  })

  afterEach(cleanup)

  test('Should pass extra data on navigate forward', async () => {
     const user = userEvent.setup();

     await user.click(screen.getByTestId('buttonLink-extra'))
     const extraData = getExtraData()

     expect(extraData).toEqual({ foo: 'bar' })
  })

  test('Should pass extra data on navigate back', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('buttonLink-extra'))
    await user.click(screen.getByTestId('buttonLink-contact'))
    await user.click(screen.getByTestId('go-back-extra'))
    const extraData = getExtraData()

    expect(extraData).toEqual('string')
  })

  test('Extra should be cleared after second navigate action', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId('buttonLink-extra'))
    await user.click(screen.getByTestId('buttonLink-extraNext'))
    const extraData = getExtraData()

    expect(extraData).toEqual(null)
  })
})


function getBreadcrumbState() {
  const resultElement = screen.getByTestId("breadcrumbs-res")
  return JSON.parse(resultElement.textContent)
}

function getExtraData() {
  const resultElement = screen.getByTestId("extra-data")
  try {
    return JSON.parse(resultElement.textContent)
  } catch {
    return resultElement.textContent
  }
}

function initRoutes(map) {
  for(const Page of Object.values(pages)) {
    const { url, title } = Page.config
    map[url] = { title, regex: url.includes(':') ? pathToRegex(url) : null }
  }

  return Object.values(pages).map(Page => {
    return {
      path: Page.config.url,
      element: <BreadcrumbsProvider routesMap={map}><Page /></BreadcrumbsProvider>
    }
  })
}
