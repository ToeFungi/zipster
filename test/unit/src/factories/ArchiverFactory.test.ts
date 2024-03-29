import * as archiver from 'archiver'
import * as archiverZipEncryptable from 'archiver-zip-encryptable'

import { createSandbox } from 'sinon'

import { Formats, Options, ZipsterError } from '../../../../src'
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
        descriptor: 'returns ZIP archiver without password',
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
        descriptor: 'returns TAR archiver without password',
        options: {
          format: Formats.TAR
        } as Options,
        assertions: () => {
          create.should.have.been.calledOnceWithExactly(Formats.TAR, defaultArchiverOptions)
          registerFormat.should.have.callCount(0)
          isRegisteredFormat.should.have.callCount(0)
        }
      },
      {
        descriptor: 'returns ZIP archiver with a password configured and registers the formatter',
        options: {
          format: Formats.ZIP_ENCRYPTED,
          password: 'Foo'
        } as Options,
        setup: () => {
          isRegisteredFormat.onFirstCall()
            .returns(false)
        },
        assertions: () => {
          create.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTED, {
            ...defaultArchiverOptions,
            password: 'Foo'
          })
          registerFormat.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTED, archiverZipEncryptable)
          isRegisteredFormat.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTED)
        }
      },
      {
        descriptor: 'returns archiver with a password configured and does not re-register formatter',
        options: {
          format: Formats.ZIP_ENCRYPTED,
          password: 'Foo'
        } as Options,
        setup: () => {
          isRegisteredFormat.onFirstCall()
            .returns(true)
        },
        assertions: () => {
          create.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTED, {
            ...defaultArchiverOptions,
            password: 'Foo'
          })
          registerFormat.should.have.callCount(0)
          isRegisteredFormat.should.have.been.calledOnceWithExactly(Formats.ZIP_ENCRYPTED)
        }
      }
    ]

    testCases.forEach(({ descriptor, setup, options, assertions }) => {
      it(descriptor, () => {
        if (setup) setup()

        const configuredArchiver = ArchiverFactory.getArchiver(options)

        configuredArchiver.should.deep.equal(archive)
        return assertions()
      })
    })

    it('throws a `ZipsterError` when the format is not supported', () => {
      const options = {
        format: 'unknown'
      } as any

      try {
        ArchiverFactory.getArchiver(options)
      } catch (error) {
        error.should.be.instanceOf(ZipsterError)
        error.message.should.deep.equal('Unknown archiver format')
      }
    })
  })
})
