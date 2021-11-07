import * as archiverZipEncryptable from 'archiver-zip-encryptable'

import { Archiver, create, isRegisteredFormat, registerFormat } from 'archiver'

import { Formats } from '../enums/Formats'
import { Options } from '../types/Options'
import { ZipsterError } from '../errors/ZipsterError'

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

    if (options.format === Formats.ZIP || options.format === Formats.TAR) {
      return create(options.format, archiverOptions)
    }

    if (options.format === Formats.ZIP_ENCRYPTED) {
      this.registerZipEncryptable()
      return create(options.format, archiverOptions)
    }

    throw new ZipsterError('Unknown archiver format')
  }

  private static registerZipEncryptable() {
    if (!isRegisteredFormat(Formats.ZIP_ENCRYPTED)) {
      registerFormat(Formats.ZIP_ENCRYPTED, archiverZipEncryptable)
    }
  }
}

export { ArchiverFactory }
