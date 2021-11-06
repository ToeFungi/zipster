import { ArchiverOptions } from 'archiver'

import { Formats } from '../enums/Formats'

/**
 * Options for the archiver
 */
interface Options extends ArchiverOptions {
  format: Formats
  password?: string
  output?: {
    name?: string
    path?: string
  }
}

export { Options }
