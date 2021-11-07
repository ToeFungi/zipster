import { SinonSandbox } from 'sinon'

const mockArchiver = (sandbox: SinonSandbox) => ({
  pipe: sandbox.stub(),
  append: sandbox.stub(),
  finalize: sandbox.stub(),
  directory: sandbox.stub()
})

export { mockArchiver }
