import path from 'node:path'

import execa from 'execa'
import { cyan, gray, green, yellow } from 'kolorist'
import minimist from 'minimist'
import prompts from 'prompts'

import { name, version } from '../package.json'

const pkgName = name.replace('create-', '')

const argv = minimist<{
  h?: boolean
  help?: boolean
  v?: boolean
  version?: boolean
}>(process.argv.slice(2), { string: ['_'] })

type Framework = {
  name: string
  display: string
  type: 'create' | 'cli'
  cmd: string
  projDir?: boolean
}

const FRAMEWORKS: Framework[] = [
  { name: 'astro', display: 'Astro', type: 'create', cmd: 'create-astro' },
  {
    name: 'docusaurus',
    display: 'Docusaurus',
    type: 'create',
    cmd: 'create-docusaurus',
  },
  { name: 'next', display: 'Next', type: 'create', cmd: 'create-next-app' },
  {
    name: 'nuxt',
    display: 'Nuxt',
    type: 'create',
    projDir: true,
    cmd: 'create-nuxt-app',
  },
  {
    name: 'react',
    display: 'React',
    type: 'create',
    projDir: true,
    cmd: 'create-react-app',
  },
  {
    name: 'redwood',
    display: 'Redwood',
    type: 'create',
    projDir: true,
    cmd: 'create-redwood-app',
  },
  { name: 'remix', display: 'Remix', type: 'create', cmd: 'create-remix' },
  { name: 'vite', display: 'Vite', type: 'create', cmd: 'create-vite-app' },
]

async function init() {
  if (argv.version || argv.v) {
    console.log(version)
    process.exit(0)
  }

  if (argv.help || argv.h) {
    console.log(gray(`  ${cyan(`yarn create ${pkgName}`)}`))
    console.log(gray('  or'))
    console.log(
      gray(`  ${cyan(`yarn create ${pkgName} ${yellow('<framework>')}`)}`)
    )
    console.log()
    console.log(gray('  Available frameworks:'))
    FRAMEWORKS.forEach((f) => {
      console.log(green(`  ${f.name}`))
    })
    process.exit(0)
  }

  let argFramework = argv._[0]
  let argProjectDir = argv._[1]

  if (!argFramework) {
    try {
      const results = await prompts({
        type: 'select',
        name: 'framework',
        message: 'Choose a framework',
        choices: FRAMEWORKS.map((f) => {
          return { title: f.display, value: f.name }
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

  const framework = FRAMEWORKS.find((f) => f.name === argFramework)

  if (!framework) {
    throw Error('No framework found')
  }

  if (framework.projDir && !argProjectDir) {
    try {
      const results = await prompts({
        type: 'text',
        name: 'project',
        message: 'Project directory?',
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

  if (framework.type === 'create') {
    const { _: commands, ...options } = argv
    const args = commands.length > 1 ? [...commands.slice(1)] : []

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

    try {
      let binPath = path.join(`node_modules/.bin/${framework.cmd}`)

      console.log(process.env.NODE_ENV)

      if (process.env.NODE_ENV === 'production') {
        const { stdout } = await execa('npm', ['config', 'get', 'prefix'])

        binPath = path.join(stdout, `bin/${framework.cmd}`)
      }

      execa.sync(`"${binPath}"`, args, {
        shell: true,
        cwd: process.cwd(),
        stdio: 'inherit',
        cleanup: true,
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }
}

init().catch((e) => {
  console.error(e)
  process.exit(1)
})
