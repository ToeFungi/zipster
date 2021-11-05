/**
 * Zipper Error is the generic error for the Zipper library
 */
class ZipperError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export { ZipperError }
