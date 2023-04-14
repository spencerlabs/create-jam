import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ExecaSyncReturnValue, SyncOptions } from 'execa'
import { execaCommandSync } from 'execa'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CLI_PATH = path.join(__dirname, '..')

const projectName = 'test-app'
const genPath = path.join(__dirname, projectName)

const run = (
  args: string[],
  options: SyncOptions = {}
): ExecaSyncReturnValue => {
  return execaCommandSync(`node ${CLI_PATH} ${args.join(' ')}`, options)
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

test('warns of invalid framework type', () => {
  const { stderr } = run(['wrong'])
  expect(stderr).toContain('No framework found:')
})
