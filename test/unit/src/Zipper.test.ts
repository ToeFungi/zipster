import * as fs from 'fs'
import * as os from 'os'
import * as Stream from 'stream'

import { createSandbox } from 'sinon'

import { mockArchiver } from '../../mocks/MockArchiver'
import { Formats, Options, Zipper } from '../../../src'
import { ArchiverFactory } from '../../../src/factories/ArchiverFactory'

describe('Zipper', () => {
  const sandbox = createSandbox()
  const directory = '/some/path/to/file.txt'

  let tmpdir: any
  let archiver: any
  let getArchiver: any
  let readFileSync: any
  let createWriteStream: any

  let zipper: Zipper

  beforeEach(() => {
    archiver = mockArchiver(sandbox)

    tmpdir = sandbox.stub(os, 'tmpdir')
    readFileSync = sandbox.stub(fs, 'readFileSync')
    createWriteStream = sandbox.stub(fs, 'createWriteStream')
    getArchiver = sandbox.stub(ArchiverFactory, 'getArchiver')

    zipper = new Zipper()
  })

  afterEach(() => sandbox.restore())

  describe('#create', () => {
    const buffer = new Buffer('')
    const stream = new Stream()

    it('resolves with the directory when the file is successfully zipped', () => {
      const expectedDirectory = '/some/path/to/file.zip'
      const options: Options = {
        format: Formats.ZIP
      }

      tmpdir.onFirstCall()
        .returns('/some/path/to')

      readFileSync.onFirstCall()
        .returns(buffer)

      createWriteStream.onFirstCall()
        .returns(stream)

      getArchiver.onFirstCall()
        .returns(archiver)

      archiver.pipe
        .onFirstCall()
        .returns()

      archiver.append
        .onFirstCall()
        .returns()

      archiver.finalize
        .onFirstCall()
        .resolves()

      return zipper.create(directory, options)
        .should.become(expectedDirectory)
    })

    it('resolves and calls the dependencies appropriately', () => {
      const expectedDirectory = '/some/path/to/file.zip'
      const options: Options = {
        format: Formats.ZIP
      }
      const archiveData = {
        name: 'file.txt'
      }

      tmpdir.onFirstCall()
        .returns('/some/path/to')

      readFileSync.onFirstCall()
        .returns(buffer)

      createWriteStream.onFirstCall()
        .returns(stream)

      getArchiver.onFirstCall()
        .returns(archiver)

      archiver.pipe
        .onFirstCall()
        .returns()

      archiver.append
        .onFirstCall()
        .returns()

      archiver.finalize
        .onFirstCall()
        .resolves()

      return zipper.create(directory, options)
        .should.become(expectedDirectory)
        .then(() => {
          tmpdir.should.have.callCount(1)
          readFileSync.should.have.been.calledOnceWithExactly(directory)
          createWriteStream.should.have.been.calledOnceWithExactly(expectedDirectory)
          getArchiver.should.have.been.calledOnceWithExactly(options)
          archiver.pipe.should.have.been.calledOnceWithExactly(stream)
          archiver.append.should.have.been.calledOnceWithExactly(buffer, archiveData)
          archiver.finalize.should.have.callCount(1)
        })
    })
  })
})
