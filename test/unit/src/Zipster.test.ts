import * as fs from 'fs'
import * as os from 'os'
import * as uuid from 'uuid'
import * as Stream from 'stream'

import { createSandbox } from 'sinon'

import { mockArchiver } from '../../mocks/MockArchiver'
import { Formats, Options, Zipster, ZipsterError } from '../../../src'
import { ArchiverFactory } from '../../../src/factories/ArchiverFactory'

describe('Zipster', () => {
  const sandbox = createSandbox()
  const defaultFileName = 'xxxx-xxxx-xxxx-xxxx'
  const directory = '/some/path/to/file.txt'
  const expectedPath = `/some/path/to/${defaultFileName}.zip`
  const options: Options = {
    format: Formats.ZIP
  }

  const stream = new Stream()
  const buffer = new Buffer('')
  const error = new Error('Something strange is afoot.')

  let tmpdir: any
  let archiver: any
  let getArchiver: any
  let readFileSync: any
  let createWriteStream: any

  let zipster: Zipster

  beforeEach(() => {
    archiver = mockArchiver(sandbox)

    tmpdir = sandbox.stub(os, 'tmpdir')
    readFileSync = sandbox.stub(fs, 'readFileSync')
    createWriteStream = sandbox.stub(fs, 'createWriteStream')
    getArchiver = sandbox.stub(ArchiverFactory, 'getArchiver')

    sandbox.stub(uuid, 'v4')
      .returns(defaultFileName as any)

    zipster = new Zipster()
  })

  afterEach(() => sandbox.restore())

  describe('#create', () => {
    beforeEach(() => {
      tmpdir.onFirstCall()
        .returns('/some/path/to')

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
    })

    it('resolves with the directory when the file is successfully zipped', () => {
      readFileSync.onFirstCall()
        .returns(buffer)

      return zipster.create(directory, options)
        .should.become(expectedPath)
    })

    it('resolves and calls the dependencies appropriately', () => {
      const archiveData = {
        name: 'file.txt'
      }

      readFileSync.onFirstCall()
        .returns(buffer)

      return zipster.create(directory, options)
        .should.become(expectedPath)
        .then(() => {
          tmpdir.should.have.callCount(1)
          readFileSync.should.have.been.calledOnceWithExactly(directory)
          createWriteStream.should.have.been.calledOnceWithExactly(expectedPath)
          getArchiver.should.have.been.calledOnceWithExactly(options)
          archiver.pipe.should.have.been.calledOnceWithExactly(stream)
          archiver.append.should.have.been.calledOnceWithExactly(buffer, archiveData)
          archiver.finalize.should.have.callCount(1)
        })
    })

    it('rejects with a `ZipsterError` when an error is thrown', () => {
      tmpdir.onFirstCall()
        .returns('/some/path/to')

      readFileSync.onFirstCall()
        .throws(error)

      return zipster.create(directory, options)
        .should.be.rejectedWith(ZipsterError, error.message)
    })
  })

  describe('#createBulk', () => {
    const directories = [
      directory,
      '/some/path/to/other.csv'
    ]

    beforeEach(() => {
      tmpdir.onFirstCall()
        .returns('/some/path/to')

      createWriteStream.onFirstCall()
        .returns(stream)

      getArchiver.onFirstCall()
        .returns(archiver)

      archiver.pipe
        .returns()

      archiver.append
        .returns()

      archiver.finalize
        .resolves()
    })

    it('resolves with the directory when the file is successfully zipped', () => {
      readFileSync.returns(buffer)

      return zipster.createBulk(directories, options)
        .should.become(expectedPath)
    })

    it('resolves with the configured directory when the file is successfully zipped', () => {
      const options: Options = {
        format: Formats.ZIP,
        output: {
          name: 'custom',
          path: '/foo/bar'
        }
      }
      const expectedDirectory = `${options.output.path}/${options.output.name}.zip`

      readFileSync.returns(buffer)

      return zipster.createBulk(directories, options)
        .should.become(expectedDirectory)
    })

    it('resolves with the configured directory when the file is successfully zipped', () => {
      const options: Options = {
        format: Formats.ZIP,
        output: {}
      }

      readFileSync.returns(buffer)

      return zipster.createBulk(directories, options)
        .should.become(expectedPath)
    })

    it('resolves after calling the appropriate dependencies', () => {
      readFileSync.returns(buffer)

      return zipster.createBulk(directories, options)
        .should.be.fulfilled
        .then(() => {
          tmpdir.should.have.callCount(1)
          readFileSync.should.have.callCount(2)
          readFileSync.should.have.been.calledWithExactly(directories[0])
          readFileSync.should.have.been.calledWithExactly(directories[1])
          createWriteStream.should.have.been.calledOnceWithExactly(expectedPath)
          getArchiver.should.have.been.calledOnceWithExactly(options)
          archiver.pipe.should.have.callCount(1)
          archiver.pipe.should.have.been.calledWithExactly(stream)
          archiver.append.should.have.callCount(2)
          archiver.append.should.have.been.calledWithExactly(buffer, { name: 'file.txt' })
          archiver.append.should.have.been.calledWithExactly(buffer, { name: 'other.csv' })
          archiver.finalize.should.have.callCount(1)
        })
    })

    it('rejects with a `ZipsterError` when an error is thrown', () => {
      readFileSync.onFirstCall()
        .throws(error)

      return zipster.createBulk(directories, options)
        .should.be.rejectedWith(ZipsterError, error.message)
    })
  })

  describe('#fromDirectory', () => {
    const path = '/some/path/to/my/directory'
    const expectedPath = `${path}/${defaultFileName}.zip`

    beforeEach(() => {
      tmpdir.onFirstCall()
        .returns(path)

      createWriteStream.onFirstCall()
        .returns(stream)

      getArchiver.onFirstCall()
        .returns(archiver)

      archiver.pipe
        .onFirstCall()
        .returns()

      archiver.directory
        .onFirstCall()
        .returns()
    })

    it('resolves with the output directory of the zipped directory', () => {
      archiver.finalize
        .onFirstCall()
        .resolves()

      return zipster.fromDirectory(path, options)
        .should.become(expectedPath)
    })

    it('resolves and calls dependencies appropriately', () => {
      archiver.finalize
        .onFirstCall()
        .resolves()

      return zipster.fromDirectory(path, options)
        .should.be.fulfilled
        .then(() => {
          tmpdir.should.have.callCount(1)
          createWriteStream.should.have.been.calledOnceWithExactly(expectedPath)
          getArchiver.should.have.been.calledOnceWithExactly(options)
          archiver.pipe.should.have.been.calledOnceWithExactly(stream)
          archiver.directory.should.have.been.calledOnceWithExactly(path, false)
          archiver.finalize.should.have.callCount(1)
        })
    })

    it('rejects with `ZipsterError` when an error occurs', () => {
      archiver.finalize
        .onFirstCall()
        .rejects(error)

      return zipster.fromDirectory(path, options)
        .should.be.rejectedWith(ZipsterError, error.message)
    })
  })
})
