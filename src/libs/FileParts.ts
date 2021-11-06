import * as path from 'path'

import { ZipsterError } from '../errors/ZipsterError'

/**
 * File Parts encapsulates the important components of a file and it's directory
 */
class FileParts {
  private readonly fileName: string
  private readonly directory: string
  private readonly fileExtension: string

  constructor(directory: string) {
    const [fileName, fileExtension] = path.basename(directory)
      .split('.')

    if (!fileName || !fileExtension) {
      throw new ZipsterError('Directory missing file name or file extension')
    }

    this.fileName = fileName
    this.directory = directory
    this.fileExtension = fileExtension
  }

  /**
   * Get the name of the file
   */
  public getName(): string {
    return this.fileName
  }

  /**
   * Get the extension of the file
   */
  public getExtension(): string {
    return this.fileExtension
  }

  /**
   * Get the directory of the file
   */
  public getDirectory(): string {
    return this.directory
  }
}

export { FileParts }
