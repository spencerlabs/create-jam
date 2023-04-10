import execa from 'execa'
import minimist from 'minimist'
import prompts from 'prompts'

import { name, version } from '../package.json'

import { FRAMEWORKS } from './lib/frameworks'
import logger from './lib/logger'

const pkgName = name.replace('create-', '')

const argv = minimist<{
  h?: boolean
  help?: boolean
  v?: boolean
  version?: boolean
}>(process.argv.slice(2), { string: ['_'] })

async function init() {
  // Version information
  if (argv.version || argv.v) {
    logger.info(version)
    process.exit(0)
  }

  // Help information
  if (argv.help || argv.h) {
    logger.text(`  ${logger.cyan(`yarn create ${pkgName}`)}`)
    logger.text('  or')
    logger.text(
      `  ${logger.cyan(
        `yarn create ${pkgName} ${logger.yellow('<framework>')}`
      )}`
    )
    logger.text()
    logger.text('  Available frameworks:')
    FRAMEWORKS.forEach((f) => {
      logger.green(`  ${f.name}`)
    })
    process.exit(0)
  }

  let argFramework = argv._[0]
  let argProjectDir = argv._[1]

  // Allow user to choose a framework
  if (!argFramework) {
    try {
      const results = await prompts({
        type: 'autocomplete',
        name: 'framework',
        message: logger.blue('Choose a framework (type to filter)'),
        choices: FRAMEWORKS.map((f) => {
          return {
            title: f.display,
            value: f.name,
          }
        }),
        validate: (value) => {
          if (!value) return 'You must choose a framework'
          return true
        },
      })

      argFramework = results.framework
    } catch (e) {
      throw Error(String(e))
    }
  }

  // Get framework from defined list
  const framework = FRAMEWORKS.find((f) => f.name === argFramework)

  if (!framework) {
    logger.error(
      `No framework found: ${logger.yellow(
        argFramework
      )} is not an available framework`
    )
    process.exit(1)
  }

  // Ask for project dir if framework requires it
  if (framework.projDir && !argProjectDir) {
    try {
      const results = await prompts({
        type: 'text',
        name: 'project',
        initial: `${framework.name}-jam-app`,
        message: logger.blue('Project directory'),
        validate: (value) => {
          if (!value)
            return `You must defined a project directory for ${framework.display}`
          return true
        },
      })

      argProjectDir = results.project
    } catch (e) {
      throw Error(String(e))
    }
  }

  const { _: commands, ...options } = argv
  const args = commands.length > 1 ? [...commands.slice(1)] : []
  const type = framework.type

  if (args.length === 0 && argProjectDir) args.push(argProjectDir)

  for (const [name, value] of Object.entries(options)) {
    // Allow both long and short form commands, e.g. --name and -n
    args.push(name.length > 1 ? `--${name}` : `-${name}`)
    if (typeof value !== 'boolean') {
      // Make sure options that take multiple quoted words
      // like `-n "create user"` are passed with quotes.
      ;(value as string).split(' ').length > 1
        ? args.push(`"${value}"`)
        : args.push(value as string)
    }
  }

  let execCmd: string

  switch (type) {
    case 'create':
      execCmd = `npx ${framework.cmd}`
      break

    case 'cli':
      execCmd = framework.cmd
      break

    default:
      throw Error('No framework command found')
  }

  // Install CLI package if needed
  if (type === 'cli' && framework.package) {
    logger.text()
    logger.info(
      `Installing framework package: ${logger.yellow(framework.package)}`
    )
    logger.text()

    // TODO: determine package manager used as use that
    try {
      execa.sync(`npm install -g ${framework.package}@latest`, {
        shell: true,
        cwd: process.cwd(),
        stdio: 'inherit',
        cleanup: true,
      })
      logger.text()
      logger.success('Package installed!')
    } catch (e) {
      throw Error(String(e))
    }
  }

  try {
    logger.text()
    logger.info(`Creating using ${framework.display} CLI...`)
    logger.text()
    execa.sync(execCmd, args, {
      shell: true,
      cwd: process.cwd(),
      stdio: 'inherit',
      cleanup: true,
    })
  } catch (e) {
    throw Error(String(e))
  }
}

init().catch((e) => {
  logger.error(e)
  process.exit(1)
})
