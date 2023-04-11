import { join } from 'node:path'

import execa from 'execa'
import type { ExecaSyncReturnValue, SyncOptions } from 'execa'
import fs from 'fs-extra'

const CLI_PATH = join(__dirname, '..')

const projectName = 'test-app'
const genPath = join(__dirname, projectName)

const run = (
  args: string[],
  options: SyncOptions = {}
): ExecaSyncReturnValue => {
  return execa.commandSync(`node ${CLI_PATH} ${args.join(' ')}`, options)
}

beforeAll(() => fs.remove(genPath))
afterEach(() => fs.remove(genPath))

test('prompts for the framework if none supplied', () => {
  const { stdout } = run([])
  expect(stdout).toContain('Choose a framework')
})

test('prompts for the project directory if needed', () => {
  const { stdout } = run(['react'])
  expect(stdout).toContain('Project directory')
})
