import { existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createJam } from '.'

const tmpDir = resolve(__dirname, '.tmp')

describe('createJam', () => {
  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  const appDir = resolve(tmpDir, 'example-app')
  const testFile = 'test.txt'

  it('should fail without directory', async () => {
    // @ts-expect-error testing errors
    await expect(createJam()).rejects.toThrow('No directory provided')
  })

  it('should fail without app type', async () => {
    // @ts-expect-error testing errors
    await expect(createJam(appDir)).rejects.toThrow('No app type provided')
  })

  it('should fail on non-existent app type', async () => {
    const fakeApp = 'superduperapp'

    await expect(createJam(appDir, fakeApp)).rejects.toThrow(
      `App option '${fakeApp}' does not exist`
    )
  })

  it('should fail on non-existent app template', async () => {
    const app = 'react'
    const fakeTemplate = 'random'

    await expect(
      createJam(appDir, app, { template: fakeTemplate })
    ).rejects.toThrow(
      `App option '${app}' does not have a template ${fakeTemplate}`
    )
  })

  it('should fail with pre-existing folder', async () => {
    mkdirSync(appDir, { recursive: true })
    writeFileSync(resolve(appDir, testFile), 'test')

    await expect(createJam(appDir, 'react')).rejects.toThrow(
      `'${appDir}' already exists and is not empty`
    )
  })

  it('should overwrite pre-existing folder', async () => {
    mkdirSync(appDir, { recursive: true })
    writeFileSync(resolve(appDir, testFile), 'test')

    await createJam(appDir, 'react', {
      overwrite: true,
      template: 'typescript',
    })

    expect(readdirSync(appDir).length !== 0).toBeTruthy()
    expect(existsSync(resolve(appDir, testFile))).toBeFalsy()
  })

  it('should fail if template not found', async () => {
    await expect(
      createJam(appDir, 'react', {
        canary: true,
        template: 'random',
      })
    ).rejects.toThrow('No template found!')
  })

  it('should remove yarn.lock', async () => {
    await createJam(appDir, 'react', {
      template: 'typescript',
    })

    expect(existsSync(resolve(appDir, 'yarn.lock'))).toBeFalsy()
  })

  it('should rename gitignore.template', async () => {
    await createJam(appDir, 'react', {
      template: 'typescript',
    })

    expect(existsSync(resolve(appDir, 'gitignore.template'))).toBeFalsy()
    expect(existsSync(resolve(appDir, '.gitignore'))).toBeTruthy()
  })

  // TEST EACH TEMPLATE

  const templatesDir = resolve(__dirname, '../templates')

  // list of framework folders in templates directory
  const frameworks = readdirSync(templatesDir, { withFileTypes: true }).filter(
    (f) => f.isDirectory()
  )

  const templateTests: { app: string; template?: string }[] = []

  // get templates for each framework
  frameworks.forEach((f) => {
    const frameworkDir = resolve(templatesDir, f.name)
    const singleTemplate = existsSync(resolve(frameworkDir, 'package.json'))

    if (singleTemplate) {
      templateTests.push({ app: f.name })
    } else {
      const frameworkTemplates = readdirSync(frameworkDir, {
        withFileTypes: true,
      }).filter((f) => f.isDirectory())

      frameworkTemplates.forEach((t) =>
        templateTests.push({ app: f.name, template: t.name })
      )
    }
  })

  templateTests.forEach((t) => {
    it(`clones ${t.app}${
      t.template ? `/${t.template}` : ''
    } template`, async () => {
      const destDir = resolve(
        tmpDir,
        `${t.app}${t.template ? '-' + t.template : ''}`
      )

      await createJam(destDir, t.app, {
        template: t.template,
      })

      expect(readdirSync(destDir).length !== 0).toBeTruthy()
    })
  })
})
