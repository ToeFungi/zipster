/**
 * Zipster Error is the generic error for the Zipster library
 */
class ZipsterError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export { ZipsterError }
