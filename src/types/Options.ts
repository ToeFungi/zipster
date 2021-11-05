import { Formats } from '../enums/Formats'

/**
 * Options for the archiver
 */
interface Options {
  format: Formats
  password?: string
  output?: {
    name?: string
    directory?: string
  }
}

export { Options }
