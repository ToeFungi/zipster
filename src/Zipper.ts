import * as fs from 'fs'
import * as os from 'os'

import { Options } from './types/Options'
import { FileParts } from './libs/FileParts'
import { ZipperError } from './errors/ZipperError'
import { ArchiverFactory } from './factories/ArchiverFactory'

/**
 * Zipper facilitates the zipping and protecting of data
 */
class Zipper {
  /**
   * ZIP a specific file with a password
   */
  public create (directory: string, options: Options): Promise<string> {
    const fileParts = new FileParts(directory)

    const archiveData = {
      name: `${fileParts.getName()}.${fileParts.getExtension()}`
    }

    const outputName = options?.output?.name ?? fileParts.getName()
    const outputDirectory = options?.output?.directory ?? os.tmpdir()

    const outputLocation = `${outputDirectory}/${outputName}.zip`

    const getSourceBuffer = () => fs.readFileSync(directory)

    const createZip = (sourceBuffer: Buffer) => {
      const writeStream = fs.createWriteStream(outputLocation)

      const archive = ArchiverFactory.getArchiver(options)

      archive.pipe(writeStream)
      archive.append(sourceBuffer, archiveData)

      return archive.finalize()
    }

    const mapSuccess = () => outputLocation

    const tapError = (error: Error) => {
      throw new ZipperError(error.message)
    }

    return Promise.resolve()
      .then(getSourceBuffer)
      .then(createZip)
      .then(mapSuccess)
      .catch(tapError)
  }
}

export { Zipper }
