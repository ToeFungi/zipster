import * as archiverZipEncryptable from 'archiver-zip-encryptable'

import { Archiver, create, isRegisteredFormat, registerFormat } from 'archiver'

import { Formats } from '../enums/Formats'
import { Options } from '../types/Options'
import { ZipperError } from '../errors/ZipperError'

/**
 * Archiver Factory creates an archiver instance configured with specified options
 */
class ArchiverFactory {
  /**
   * Get a configured archiver instance
   */
  public static getArchiver(options: Options): Archiver {
    const { format, ...rest } = options
    const archiverOptions = {
      forceLocalTime: true,
      zlib: {
        level: 9
      },
      ...rest
    }

    if (options.format === Formats.ZIP) {
      return create(options.format, archiverOptions)
    }

    if (options.format === Formats.ZIP_ENCRYPTABLE) {
      this.registerZipEncryptable()
      return create(options.format, archiverOptions)
    }

    throw new ZipperError('Unknown archiver format')
  }

  private static registerZipEncryptable() {
    if (!isRegisteredFormat(Formats.ZIP_ENCRYPTABLE)) {
      registerFormat(Formats.ZIP_ENCRYPTABLE, archiverZipEncryptable)
    }
  }
}

export { ArchiverFactory }
