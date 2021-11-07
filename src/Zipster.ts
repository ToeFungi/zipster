import * as fs from 'fs'
import * as os from 'os'
import * as uuid from 'uuid'

import { IOptions } from 'glob'
import { Archiver } from 'archiver'

import { Options } from './types/Options'
import { FileParts } from './libs/FileParts'
import { ZipsterError } from './errors/ZipsterError'
import { ArchiverFactory } from './factories/ArchiverFactory'

/**
 * Zipster facilitates the zipping and protecting of data
 */
class Zipster {
  /**
   * Add a single file to a single ZIP file
   */
  public fromPath(path: string, options: Options): Promise<string> {
    const fileParts = new FileParts(path)

    const archiveData = {
      name: `${fileParts.getName()}.${fileParts.getExtension()}`
    }

    const outputLocation = this.getOutputPath(options)

    const getSourceBuffer = (): Buffer => fs.readFileSync(path)

    const createZip = (sourceBuffer: Buffer): Promise<void> => {
      const archive = this.getArchiver(options, outputLocation)
      archive.append(sourceBuffer, archiveData)
      return archive.finalize()
    }

    const mapSuccess = (): string => outputLocation

    const tapError = (error: Error): never => {
      throw new ZipsterError(error.message)
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
  public fromPaths(paths: string[], options: Options): Promise<string> {
    const outputLocation = this.getOutputPath(options)

    const mapToFileParts = () => paths.map((path: string) => new FileParts(path))

    const appendToZIP = (fileParts: FileParts[]) => {
      const archive = this.getArchiver(options, outputLocation)

      fileParts.forEach((filePart: FileParts) => {
        const sourceBuffer = fs.readFileSync(filePart.getPath())
        const archiveData = {
          name: `${filePart.getName()}.${filePart.getExtension()}`
        }

        archive.append(sourceBuffer, archiveData)
      })

      return archive.finalize()
    }

    const mapSuccess = () => outputLocation

    const tapError = (error: Error): never => {
      throw new ZipsterError(error.message)
    }

    return Promise.resolve()
      .then(mapToFileParts)
      .then(appendToZIP)
      .then(mapSuccess)
      .catch(tapError)
  }

  /**
   * Create a ZIP containing all files within specified directory
   */
  public fromDirectory(path: string, options: Options): Promise<string> {
    const outputLocation = this.getOutputPath(options)

    const createZip = (): Promise<void> => {
      const archive = this.getArchiver(options, outputLocation)
      archive.directory(path, false)
      return archive.finalize()
    }

    const mapSuccess = (): string => outputLocation

    const tapError = (error: Error): never => {
      throw new ZipsterError(error.message)
    }

    return Promise.resolve()
      .then(createZip)
      .then(mapSuccess)
      .catch(tapError)
  }

  /**
   * Create a ZIP containing files matching the specified pattern at the specified path
   */
  public fromPattern(path: string, pattern: string, options: Options): Promise<string> {
    const outputLocation = this.getOutputPath(options)
    const globOptions: IOptions = {
      cwd: path
    }

    const createZip = (): Promise<void> => {
      const archive = this.getArchiver(options, outputLocation)
      archive.glob(pattern, globOptions)
      return archive.finalize()
    }

    const mapSuccess = (): string => outputLocation

    const tapError = (error: Error): never => {
      throw new ZipsterError(error.message)
    }

    return Promise.resolve()
      .then(createZip)
      .then(mapSuccess)
      .catch(tapError)
  }

  /**
   * Returns the configured archiver
   */
  private getArchiver(options: Options, outputLocation: string): Archiver {
    const writeStream = fs.createWriteStream(outputLocation)
    const archive = ArchiverFactory.getArchiver(options)

    archive.pipe(writeStream)
    return archive
  }

  /**
   * Returns the output path configured with specified options or defaults
   */
  private getOutputPath(options: Options): string {
    const outputName = options.output?.name ?? uuid.v4()
    const outputDirectory = options.output?.path ?? os.tmpdir()

    return `${outputDirectory}/${outputName}.zip`
  }
}

export { Zipster }
