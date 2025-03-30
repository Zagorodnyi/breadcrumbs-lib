const $ = Symbol('data')

class ExtraStore {
  static [$] = null

  static get data() {
    return this[$]?.data || null
  }

  /** Route that the `extra` was passed to */
  static get targetPath() {
    return this[$]?.path || null
  }

  static setData(path, data) {
    this[$] = { path, data }
  }

  static clear() {
    this[$] = null
  }
}

export default ExtraStore

/**
* Returns the `extra` passed from the previous route as plain javascript value.
* **NOT REACTIVE**
*/
export function useExtra() {
  return ExtraStore?.data
}
