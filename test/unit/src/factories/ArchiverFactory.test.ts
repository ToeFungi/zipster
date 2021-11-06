import * as archiver from 'archiver'
import * as archiverZipEncryptable from 'archiver-zip-encryptable'

import { createSandbox } from 'sinon'

import { Formats, Options, ZipperError } from '../../../../src'
import { ArchiverFactory } from '../../../../src/factories/ArchiverFactory'

describe('ArchiverFactory', () => {
  const sandbox = createSandbox()

  let archive = {
    pipe: sandbox.stub(),
    append: sandbox.stub(),
    finalize: sandbox.stub()
  }

  let create: any
  let registerFormat: any
  let isRegisteredFormat: any

  beforeEach(() => {
    create = sandbox.stub(archiver, 'create')
    registerFormat = sandbox.stub(archiver, 'registerFormat')
    isRegisteredFormat = sandbox.stub(archiver, 'isRegisteredFormat')

    create.onFirstCall()
      .returns(archive)
  })

  afterEach(() => sandbox.restore())

  describe('#getArchiver', () => {
    const defaultArchiverOptions = {
      forceLocalTime: true,
      zlib: {
        level: 9
      }
    }

    const testCases = [
      {
        descriptor: 'returns archiver without password',
        options: {
          format: Formats.ZIP
        } as Options,
        assertions: () => {
          create.should.have.been.calledOnceWithExactly(Formats.ZIP, defaultArchiverOptions)
          registerFormat.should.have.callCount(0)
          isRegisteredFormat.should.have.callCount(0)
        }
      },
      {
        descriptor: 'returns archiver with a password',
        options: {
          format: Formats.ZIP_ENCRYPTABLE,
          password: 'Foo'
        } as Options,
        assertions: () => {
          create.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTABLE, {
            ...defaultArchiverOptions,
            password: 'Foo'
          })
          registerFormat.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTABLE, archiverZipEncryptable)
          isRegisteredFormat.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTABLE)
        }
      }
    ]

    testCases.forEach(({ descriptor, options, assertions }) => {
      it(descriptor, () => {
        const configuredArchiver = ArchiverFactory.getArchiver(options)

        configuredArchiver.should.deep.equal(archive)
        return assertions()
      })
    })

    it('throws an error when the format is not supported', () => {
      const options = {
        format: 'unknown'
      } as any

      try {
        ArchiverFactory.getArchiver(options)
      } catch (error) {
        error.should.be.instanceOf(ZipperError)
        error.message.should.deep.equal('Unknown archiver format')
      }
    })
  })
})