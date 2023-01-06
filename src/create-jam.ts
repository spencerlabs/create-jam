import path from 'node:path'

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

  if (!dir) {
    throw new Error('No directory provided')
  }

  if (!app) {
    throw new Error('No app type provided')
  }

  if (!frameworkNames.includes(app) && !options?.canary) {
    throw new Error(`App option '${app}' does not exist`)
  }

  if (
    options?.template &&
    !options.canary &&
    !frameworks[app].includes(options.template)
  ) {
    throw new Error(
      `App option '${app}' does not have a template ${options.template}`
    )
  }
  const appDirExists = fs.existsSync(dir)

  if (appDirExists && !options?.overwrite) {
    // make sure that the target directory is empty
    if (fs.readdirSync(dir).length > 0) {
      throw new Error(`'${dir}' already exists and is not empty`)
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
    throw new Error('No template found!')
  }

  fs.rmSync(path.join(dir, 'yarn.lock'), { force: true })
  fs.rmSync(path.join(dir, 'package-lock.json'), {
    force: true,
  })

  const gitignoreFile = path.join(dir, 'gitignore.template')

  if (fs.existsSync(gitignoreFile)) {
    fs.renameSync(gitignoreFile, path.join(dir, '.gitignore'))
  }
}
