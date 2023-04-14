import { execaSync } from 'execa'
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
    Object.keys(FRAMEWORKS).forEach((f) => {
      logger.green(`  ${f}`)
    })
    process.exit(0)
  }

  const getFramework = (name: string) => {
    const found = FRAMEWORKS[name]

    if (!found) {
      logger.warn(`No framework found: '${name}' is not an available framework`)
    }

    return found
  }

  let framework = argv._[0] ? getFramework(argv._[0]) : undefined

  const response = await prompts(
    [
      {
        type: !framework ? 'autocomplete' : null,
        name: 'framework',
        message: logger.blue('Choose a framework (type to filter)'),
        choices: Object.keys(FRAMEWORKS).map((f) => {
          return {
            title: FRAMEWORKS[f].name,
            value: f,
          }
        }),
        validate: (value) => {
          if (!value) return 'You must choose a framework'
          return true
        },
      },
      {
        type: () => (framework?.dir ? 'text' : null),
        name: 'project',
        initial: (prev) => `${prev || argv._[0]}-jam-app`,
        message: logger.blue('Project directory'),
        validate: (value) => {
          if (!value) {
            return `You must define a project directory for this framework`
          }
          return true
        },
      },
    ],
    {
      onSubmit: (prompt, answer) => {
        if (prompt.name === 'framework') {
          framework = getFramework(answer)
        }
      },
      onCancel: (prompt) => {
        throw Error(`You must provide the '${prompt.name}'`)
      },
    }
  )

  if (!framework) throw Error('No framework found!')

  const { _: commands, ...options } = argv
  const args = commands.length > 1 ? [...commands.slice(1)] : []

  if (args.length === 0 && response.project) args.push(response.project)

  // Create an array of passed commands
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

  // Install CLI package if needed
  if (framework.pkg) {
    logger.text()
    logger.info(`Installing framework package: ${logger.yellow(framework.pkg)}`)
    logger.text()

    // TODO: determine package manager used and use that
    execaSync(`npm install -g ${framework.pkg}@latest`, {
      shell: true,
      cwd: process.cwd(),
      stdio: 'inherit',
      cleanup: true,
    })

    logger.text()
    logger.success('Package installed!')
  }

  logger.text()
  logger.info(`Starting ${framework.name} CLI...`)
  logger.text()

  execaSync(framework.cmd, args, {
    shell: true,
    cwd: process.cwd(),
    stdio: 'inherit',
    cleanup: true,
  })
}

init().catch((e) => {
  logger.error(e)
  process.exit(1)
})
