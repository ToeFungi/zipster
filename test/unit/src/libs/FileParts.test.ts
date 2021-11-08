import { FileParts } from '../../../../src'

describe('FileParts', () => {
  const fileName = 'file'
  const fileExtension = 'txt'
  const path = `/some/path/to/${fileName}.${fileExtension}`

  let fileParts: FileParts

  beforeEach(() => {
    fileParts = new FileParts(path)
  })

  describe('#constructor', () => {
    it('throws a `ZipsterError` when missing file extension', () => {
      try {
        new FileParts('/malformed/path')
      } catch (error) {
        return error.message.should.deep.equal('Path missing file extension')
      }
    })

    it('throws a `ZipsterError` when missing file name', () => {
      try {
        new FileParts('')
      } catch (error) {
        return error.message.should.deep.equal('Path missing file name')
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

  describe('#getPath', () => {
    it('returns the initial path', () => {
      return fileParts.getPath()
        .should.deep.equal(path)
    })
  })
})
