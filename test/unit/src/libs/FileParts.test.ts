import { FileParts } from '../../../../src/libs/FileParts'

describe('FileParts', () => {
  const fileName = 'file'
  const fileExtension = 'txt'
  const directory = `/some/path/to/${fileName}.${fileExtension}`

  let fileParts: FileParts

  beforeEach(() => {
    fileParts = new FileParts(directory)
  })

  describe('#constructor', () => {
    it('throws a `ZipsterError` when the directory is malformed', () => {
      try {
        new FileParts('/malformed/directory')
      } catch (error) {
        return error.message.should.deep.equal('Directory missing file name or file extension')
      }
    })
  })

  describe('#getName', () => {
    it('returns the appropriate name of the file', () => {
      return fileParts.getName()
        .should.deep.equal(fileName)
    })
  })

  describe('#getExtension', () => {
    it('returns the extension of the file', () => {
      return fileParts.getExtension()
        .should.deep.equal(fileExtension)
    })
  })

  describe('#getDirectory', () => {
    it('returns the initial directory', () => {
      return fileParts.getDirectory()
        .should.deep.equal(directory)
    })
  })
})
