import path from 'node:path'

import { bold, red } from 'colorette'
import fs from 'fs-extra'
import { downloadTemplate } from 'giget'

import { version } from '../package.json'

import frameworks from './templates'

export type CreateJamOptions = {
  /**
   * Pull from the templates directory on the default branch rather than the published package tagged branch
   *
   * Note: This can have breaking changes that are not published yet, use with caution!
   */
  canary?: boolean
  /** If the current directory exists, should it be overwritten */
  overwrite?: boolean
  /** Template for the app, if more than one exists */
  template?: string
}

export const createJam = async (
  /** Directory to output the app template */
  dir: string,
  /** App type (ex. 'react') */
  app: string,
  /** Configuration options */
  options?: CreateJamOptions
) => {
  const frameworkNames = Object.keys(frameworks)

  if (!frameworkNames.includes(app) && !options?.canary) {
    console.error(`${red(`App option '${app}' does not exist`)}`)
    process.exit(1)
  }

  const appDirExists = fs.existsSync(dir)

  if (appDirExists && !options?.overwrite) {
    // make sure that the target directory is empty
    if (fs.readdirSync(dir).length > 0) {
      console.error(bold(red(`\n'${dir}' already exists and is not empty\n`)))
      process.exit(1)
    }
  } else {
    fs.ensureDirSync(path.dirname(dir))
  }

  const copyPath = `templates/${app}${
    options?.template ? `/${options?.template}` : ''
  }`

  await downloadTemplate(
    `github:spencerlabs/create-jam/${copyPath}#${
      options?.canary ? 'next' : `v${version}`
    }`,
    {
      dir: dir,
      force: options?.overwrite,
      forceClean: options?.overwrite,
    }
  )

  if (fs.readdirSync(dir).length === 0) {
    console.error(bold(red('No template found!')))
    process.exit(1)
  }

  fs.rmSync(path.join(dir, 'yarn.lock'), { force: true })
  fs.rmSync(path.join(dir, 'package-lock.json'), {
    force: true,
  })

  const gitignoreFile = path.join(dir, 'gitignore.template')

  if (fs.existsSync(gitignoreFile)) {
    fs.rename(gitignoreFile, path.join(dir, '.gitignore'))
  }
}
