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
   * Add a single file to a single ZIP file
   */
  public create (directory: string, options: Options): Promise<string> {
    const fileParts = new FileParts(directory)

    const archiveData = {
      name: `${fileParts.getName()}.${fileParts.getExtension()}`
    }

    const outputName = options?.output?.name ?? fileParts.getName()
    const outputDirectory = options?.output?.directory ?? os.tmpdir()

    const outputLocation = `${outputDirectory}/${outputName}.zip`

    const getSourceBuffer = (): Buffer => fs.readFileSync(directory)

    const createZip = (sourceBuffer: Buffer): Promise<void> => {
      const writeStream = fs.createWriteStream(outputLocation)

      const archive = ArchiverFactory.getArchiver(options)

      archive.pipe(writeStream)
      archive.append(sourceBuffer, archiveData)

      return archive.finalize()
    }

    const mapSuccess = (): string => outputLocation

    const tapError = (error: Error): never => {
      throw new ZipperError(error.message)
    }

    return Promise.resolve()
      .then(getSourceBuffer)
      .then(createZip)
      .then(mapSuccess)
      .catch(tapError)
  }

  /**
   * Add multiple files to a single ZIP file
   */
  public createBulk (directories: string[], options: Options): Promise<string> {
    const outputName = options?.output?.name ?? 'archive'
    const outputDirectory = options?.output?.directory ?? os.tmpdir()

    const outputLocation = `${outputDirectory}/${outputName}.zip`

    const mapToFileParts = () => directories.map((directory: string) => new FileParts(directory))

    const appendToZIP = (fileParts: FileParts[]) => {
      const writeStream = fs.createWriteStream(outputLocation)
      const archive = ArchiverFactory.getArchiver(options)

      archive.pipe(writeStream)

      fileParts.forEach((filePart: FileParts) => {
        const sourceBuffer = fs.readFileSync(filePart.getDirectory())
        const archiveData = {
          name: `${filePart.getName()}.${filePart.getExtension()}`
        }

        archive.append(sourceBuffer, archiveData)
      })

      return archive.finalize()
    }

    const mapSuccess = () => outputLocation

    const tapError = (error: Error): never => {
      throw new ZipperError(error.message)
    }

    return Promise.resolve()
      .then(mapToFileParts)
      .then(appendToZIP)
      .then(mapSuccess)
      .catch(tapError)
  }
}

export { Zipper }
