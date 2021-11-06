import * as nodePath from 'path'

import { ZipsterError } from '../errors/ZipsterError'

/**
 * File Parts encapsulates the important components of a file and it's path
 */
class FileParts {
  private readonly path: string
  private readonly fileName: string
  private readonly fileExtension: string

  constructor(path: string) {
    const [fileName, fileExtension] = nodePath.basename(path)
      .split('.')

    if (!fileName || !fileExtension) {
      throw new ZipsterError('Path missing file name or file extension')
    }

    this.path = path
    this.fileName = fileName
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
   * Get the path of the file
   */
  public getPath(): string {
    return this.path
  }
}

export { FileParts }
