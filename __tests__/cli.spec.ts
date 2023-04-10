import fs from 'node:fs'
import { join } from 'node:path'

import execa from 'execa'
import type { ExecaSyncReturnValue, SyncOptions } from 'execa'

const CLI_PATH = join(__dirname, '..')

const projectName = 'test-app'
const genPath = join(__dirname, projectName)

const run = (
  args: string[],
  options: SyncOptions = {}
): ExecaSyncReturnValue => {
  return execa.sync(`node ${CLI_PATH} ${args.join(' ')}`, options)
}

beforeAll(() => fs.rmSync(genPath, { recursive: true }))
afterEach(() => fs.rmSync(genPath, { recursive: true }))

test('prompts for the framework if none supplied', () => {
  const { stdout } = run([])
  expect(stdout).toContain('Choose a framework')
})
