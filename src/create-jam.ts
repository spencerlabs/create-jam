#!/usr/bin/env node

import path from 'path'

import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs-extra'
import { downloadTemplate } from 'giget'
import inquirer from 'inquirer'
import Listr from 'listr'
import shell from 'shelljs'
import slugify from 'slugify'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { name, version } from '../package.json'

import frameworks from './templates'
;(async () => {
  const frameworkNames = Object.keys(frameworks)

  const {
    _: args,
    app,
    bare,
    'no-init': noInit,
    'no-install': noInstall,
    overwrite,
    typescript,
  } = await yargs(hideBin(process.argv))
    .scriptName(name)
    .usage('Usage: $0 <project-directory> [app] [options]')
    .example('$0 new-app', 'Creates a new Jamstack app')
    .option('bare', {
      alias: 'b',
      default: false,
      describe: 'Shorthand to run all disabling commands',
      type: 'boolean',
    })
    .option('no-init', {
      default: false,
      describe: 'Disable automatic git init',
      type: 'boolean',
    })
    .option('no-install', {
      default: false,
      describe: 'Disable automatic install of packages',
      type: 'boolean',
    })
    .option('overwrite', {
      alias: 'o',
      default: false,
      describe: 'Allow overwrite of project directory if it already exists',
      type: 'boolean',
    })
    .option('typescript', {
      alias: 't',
      default: false,
      describe: 'Prefer TypeScript template if available',
      type: 'boolean',
    })
    .version(version)
    .parse()

  // Get the directory for installation from the args
  const targetDir = slugify(args[0] as string, {
    lower: true,
    strict: true,
  })

  // Throw an error if there is no target directory specified
  if (!targetDir) {
    console.error('Please specify the project directory')
    console.log(
      `  ${chalk.cyan('yarn create jam-app')} ${chalk.green(
        '<project-directory>'
      )}`
    )
    console.log()
    console.log('For example:')
    console.log(
      `  ${chalk.cyan('yarn create jam-app')} ${chalk.green('new-react-app')}`
    )
    process.exit(1)
  }

  if (!frameworkNames.includes(app)) {
    console.error(`App option '${app}' does not exist`)
    console.log()
    console.log('Available options are:')
    console.log(frameworkNames.join(', '))
    process.exit(1)
  }

  const newAppDir = path.resolve(process.cwd(), targetDir)
  const appDirExists = fs.existsSync(newAppDir)

  // Init config object
  const config: {
    app?: string
    pkgManager: 'yarn' | 'npm'
    template?: string
  } = {
    app,
    pkgManager: 'yarn',
    template: undefined,
  }

  // Switch package managers
  if (!shell.which('yarn')) config.pkgManager = 'npm'

  // Prompt for app value if none provided
  if (!config.app) {
    const { app: chosenApp } = await inquirer.prompt([
      {
        type: 'list',
        name: 'app',
        message: 'Select a framework',
        choices: frameworkNames,
      },
    ])

    config.app = chosenApp
  }

  const templates = frameworks[config.app as string]

  const singleTemplate = templates.length === 0

  if (!singleTemplate) {
    let availableTemplates = templates

    // Select TS template if -ts flag provided and `typescript` template exists
    if (typescript && availableTemplates.includes('typescript')) {
      config.template = 'typescript'

      // Filter TS templates if -ts flag provided and no `typescript` template exists
    } else if (typescript && !availableTemplates.includes('typescript')) {
      const filteredTemplates = templates.filter((t) => t.endsWith('-ts'))

      if (filteredTemplates.length > 0) availableTemplates = filteredTemplates
    }

    if (availableTemplates.length === 1) config.template = availableTemplates[0]

    // Prompt for template value based on app if no template selected from previous actions
    if (!config.template) {
      const { template } = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Select a template',
          choices: availableTemplates,
        },
      ])

      config.template = template
    }
  }

  const createProjectTasks = ({
    newAppDir,
    overwrite,
  }: {
    newAppDir: string
    overwrite: boolean
  }) => {
    return [
      {
        title: `${
          appDirExists ? 'Using' : 'Creating'
        } directory '${newAppDir}'`,
        task: async () => {
          if (appDirExists && !overwrite) {
            // make sure that the target directory is empty
            if (fs.readdirSync(newAppDir).length > 0) {
              console.error(
                chalk.bold.red(
                  `\n'${newAppDir}' already exists and is not empty\n`
                )
              )
              process.exit(1)
            }
          } else {
            fs.ensureDirSync(path.dirname(newAppDir))
          }

          const copyPath = `templates/${config.app}${
            !singleTemplate ? `/${config.template}` : ''
          }`

          await downloadTemplate(
            `github:spencerlabs/create-jam/${copyPath}#${
              process.env.NODE_ENV === 'production' ? 'main' : 'next'
            }`,
            {
              dir: newAppDir,
              force: overwrite,
              forceClean: overwrite,
            }
          )

          if (fs.readdirSync(newAppDir).length === 0) {
            throw new Error('No template found!')
          }

          fs.rmSync(path.join(newAppDir, 'yarn.lock'), { force: true })
          fs.rmSync(path.join(newAppDir, 'package-lock.json'), { force: true })

          const gitignoreFile = path.join(newAppDir, 'gitignore.template')

          if (fs.existsSync(gitignoreFile)) {
            fs.rename(gitignoreFile, path.join(newAppDir, '.gitignore'))
          }
        },
      },
      {
        title: 'Updating package name',
        skip: () => {
          const fileName = path.join(newAppDir, 'package.json')

          if (!fs.existsSync(fileName)) {
            return 'No package.json file'
          }

          const file = require(fileName)

          if (!file.name) {
            return 'No name in package.json file'
          }
        },
        task: () => {
          const fileName = `${newAppDir}/package.json`
          const file = require(fileName)

          file.name = targetDir

          fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
        },
      },
    ]
  }

  const installNodeModulesTasks = ({ newAppDir }: { newAppDir: string }) => {
    return [
      {
        title: `Running '${config.pkgManager} install'...`,
        task: () => {
          return execa(`${config.pkgManager} install`, {
            shell: true,
            cwd: newAppDir,
          })
        },
      },
    ]
  }

  const initGit = ({ newAppDir }: { newAppDir: string }) => {
    return [
      {
        title: "Running 'git init'...",
        task: () => {
          return execa('git init', {
            shell: true,
            cwd: newAppDir,
          })
        },
      },
      {
        title: 'Renaming git default branch...',
        task: () => {
          return execa('git checkout -b main', {
            shell: true,
            cwd: newAppDir,
          })
        },
      },
      {
        title: "Running 'git add .'...",
        task: () => {
          return execa('git add .', {
            shell: true,
            cwd: newAppDir,
          })
        },
      },
      {
        title: "Running 'git commit'...",
        task: () => {
          return execa(
            `git commit -m 'Init ${config.app}/${config.template} app with create-jam'`,
            {
              shell: true,
              cwd: newAppDir,
            }
          )
        },
      },
    ]
  }

  new Listr(
    [
      {
        title: `Creating ${config.app} app${
          config.template ? ` with ${config.template} template` : ''
        }`,
        task: () =>
          new Listr(createProjectTasks({ newAppDir, overwrite: overwrite }), {
            exitOnError: true,
          }),
      },
      {
        title: 'Installing packages',
        skip: () => {
          if (bare || noInstall) {
            return 'Skipping install on request'
          }
        },
        task: () =>
          new Listr(installNodeModulesTasks({ newAppDir }), {
            exitOnError: true,
          }),
      },
      {
        title: 'Initializing git',
        skip: () => {
          if (bare || noInit) {
            return 'Skipping git initialization on request'
          }
        },
        task: () => new Listr(initGit({ newAppDir }), { exitOnError: true }),
      },
    ],
    { exitOnError: true }
  )
    .run()
    .then(() => {
      ;['', chalk.greenBright('Thanks for using create-jam!'), ''].map((item) =>
        console.log(item)
      )
    })
    .catch((e) => {
      console.log()
      console.log(e)

      if (fs.existsSync(newAppDir)) {
        console.log(
          chalk.bold.red(`\nWarning: Directory `) +
            chalk.gray(`'${newAppDir}' `) +
            chalk.bold.red(
              `was created. However, the installation could not complete due to an error.\n`
            )
        )
      }
      process.exit(1)
    })
})()
