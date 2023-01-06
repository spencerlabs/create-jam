#!/usr/bin/env node
import path from 'node:path'

import { bold, cyan, gray, green, red, yellow } from 'colorette'
import execa from 'execa'
import fs from 'fs-extra'
import { Listr } from 'listr2'
import mri from 'mri'
import prompts from 'prompts'
import shell from 'shelljs'
import slugify from 'slugify'

import { name, version as pkgVersion } from '../package.json'

import frameworks from './templates'

import { createJam } from '.'

async function main() {
  const {
    _: args,
    bare,
    canary,
    help,
    noInit,
    noInstall,
    overwrite,
    template,
    typescript,
    verbose,
    version,
  } = mri(process.argv.slice(2), {
    default: {
      bare: false,
      canary: false,
      help: false,
      noInit: false,
      noInstall: false,
      overwrite: false,
      template: '',
      typescript: false,
      verbose: false,
      version: false,
    },
    alias: {
      b: 'bare',
      h: 'help',
      o: 'overwrite',
      t: 'typescript',
      v: 'version',
    },
  })

  if (verbose) {
    process.env.DEBUG = process.env.DEBUG || 'true'
  }

  if (help) {
    console.log('Usage:')
    console.error(
      `  ${cyan(`yarn create ${name.replace('create-', '')}`)} ${green(
        '<project-dir>'
      )} ${yellow('[<app>]')} ${gray(
        '[--bare] [--canary] [--no-init] [--no-install] [--overwrite] [--typescript] [--verbose] [--version]'
      )}`
    )
    process.exit(1)
  }

  if (version) {
    console.log(`  ${gray(`v${pkgVersion}`)}`)
    process.exit(0)
  }

  const targetDir = args[0]
  const app = args[1] as string | undefined

  // Init config object
  const config: {
    app?: string
    dir?: string
    pkgManager: 'yarn' | 'npm'
    template?: string
  } = {
    app,
    dir: targetDir,
    pkgManager: 'yarn',
    template: undefined,
  }

  // Prompt for directory value if none provided
  if (!config.dir) {
    const { dir } = await prompts(
      {
        type: 'text',
        name: 'dir',
        message: 'Directory name',
      },
      { onCancel: () => process.exit(1) }
    )

    config.dir = dir as string
  }

  config.dir = slugify(config.dir, {
    lower: true,
    strict: true,
  })

  const frameworkNames = Object.keys(frameworks)

  // Switch package managers
  if (!shell.which('yarn')) config.pkgManager = 'npm'

  if (app && !frameworkNames.includes(app)) {
    config.app = undefined

    console.error(`${red(`App option '${app}' does not exist`)}`)
    console.log()
  }

  // Prompt for app value if none provided
  if (!config.app) {
    const { app: chosenApp } = await prompts(
      {
        type: 'autocomplete',
        name: 'app',
        message: 'Select a framework',
        choices: frameworkNames.map((f) => ({ title: f, value: f })),
      },
      { onCancel: () => process.exit(1) }
    )

    config.app = chosenApp as string
  }

  const templates = frameworks[config.app as string]

  if (template) {
    if (!templates.includes(template)) {
      if (canary) {
        console.warn(
          yellow(
            "You've provided a template that does not seem to exist but you are running on canary so that may be desired."
          )
        )
        config.template = template
      } else {
        console.warn(
          yellow(
            "You've provided a template that does not seem to exist, ignoring the provided value."
          )
        )
      }
    } else {
      config.template = template
    }
  }

  const singleTemplate = templates.length === 0

  if (!singleTemplate && !config.template) {
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
      const { template } = await prompts(
        {
          type: 'autocomplete',
          name: 'template',
          message: `Select a ${config.app} template`,
          choices: availableTemplates.map((f) => ({ title: f, value: f })),
        },
        { onCancel: () => process.exit(1) }
      )

      config.template = template
    }
  }

  const newAppDir = path.resolve(process.cwd(), config.dir)
  const appDirExists = fs.existsSync(config.dir)

  new Listr(
    [
      {
        title: `Creating ${green(config.app)} app${
          config.template ? ` with ${green(config.template)} template` : ''
        }`,
        task: (_ctx, task) =>
          task.newListr(
            [
              {
                title: `${
                  appDirExists ? 'Using' : 'Creating'
                } directory '${newAppDir}'`,
                task: async () => {
                  await createJam(newAppDir, config.app as string, {
                    canary,
                    template: config.template,
                    overwrite,
                  })
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

                  return false
                },
                task: () => {
                  const fileName = path.join(newAppDir, 'package.json')

                  const file = require(fileName)

                  file.name = targetDir

                  fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
                },
              },
            ],
            { exitOnError: true, rendererOptions: { collapse: false } }
          ),
      },
      {
        title: 'Installing packages',
        skip: () => (bare || noInstall ? 'Skipping install on request' : false),
        task: () => {
          return execa(`${config.pkgManager} install`, {
            shell: true,
            cwd: newAppDir,
          })
        },
      },
      {
        title: 'Initializing git',
        skip: () =>
          bare || noInit ? 'Skipping git initialization on request' : false,
        task: (_ctx, task) => {
          return task.newListr(
            [
              {
                title: "Running 'git init'",
                task: () => {
                  return execa('git init', {
                    shell: true,
                    cwd: newAppDir,
                  })
                },
              },
              {
                title: 'Renaming git default branch',
                task: () => {
                  return execa('git checkout -b main', {
                    shell: true,
                    cwd: newAppDir,
                  })
                },
              },
              {
                title: "Running 'git add .'",
                task: () => {
                  return execa('git add .', {
                    shell: true,
                    cwd: newAppDir,
                  })
                },
              },
              {
                title: "Running 'git commit'",
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
            ],
            { exitOnError: true, rendererOptions: { collapse: false } }
          )
        },
      },
    ],
    { exitOnError: true, rendererOptions: { collapse: false } }
  )
    .run()
    .then(() => {
      ;[
        '',
        green(`Thanks for using ${name}!`),
        '',
        gray('Get started:'),
        cyan(`cd ${targetDir}`),
      ].map((item) => console.log(item))

      if (bare || noInstall) {
        console.log(cyan(`${config.pkgManager} install`))
      }

      console.log('')
    })
    .catch((e) => {
      console.log()
      console.log(e)

      if (fs.existsSync(newAppDir)) {
        console.log(
          bold(red(`\nWarning: Directory `)) +
            gray(`'${newAppDir}' `) +
            bold(
              red(
                `was created. However, the installation could not complete due to an error.\n`
              )
            )
        )
      }
      process.exit(1)
    })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
