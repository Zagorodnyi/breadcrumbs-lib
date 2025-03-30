class BreadcrumbItem {
  constructor({ path, title, state = {} }) {
    this.#path = path
    this.#title = title
    this.#state = state
  }

  get path() {
    return this.#path
  }

  get state() {
    return this.#state
  }

  get title() {
    return this.#title
  }

  setState(state) {
    this.#state = state
  }

  navigate() {
    window.location.pathname = this.#path
    return true
  }

  // Used for JSON serialization
  toJSON() {
    return {
      path: this.#path,
      state: this.#state,
      title: this.#title,
    }
  }

  #path
  #state
  #title
}

export default BreadcrumbItem
