import path from 'node:path'

import execa from 'execa'
import { Argv, Arguments } from 'yargs'

export const builder = (yargs: Argv) =>
  yargs
    .strictOptions(false)
    .strictCommands(false)
    .strict(false)
    .parserConfiguration({
      'camel-case-expansion': false,
    })
    .help(false)
    .version(false)

export const binHandler = async (
  {
    _,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $0,
    commands = [],
    ...options
  }: Arguments,
  binCmd: string
) => {
  const args: string[] = commands as string[]

  for (const [name, value] of Object.entries(options)) {
    if (name === 'project-directory') {
      args.push(value as string)
      continue
    }

    // Allow both long and short form commands, e.g. --name and -n
    args.push(name.length > 1 ? `--${name}` : `-${name}`)
    if (typeof value !== 'boolean') {
      // Make sure options that take multiple quoted words
      // like `-n "create user"` are passed to prisma with quotes.
      ;(value as string).split(' ').length > 1
        ? args.push(`"${value}"`)
        : args.push(value as string)
    }
  }

  try {
    let binPath = path.join(`node_modules/.bin/${binCmd}`)

    if (process.env.NODE_ENV === 'production') {
      const { stdout } = await execa('npm', ['config', 'get', 'prefix'])

      binPath = path.join(stdout, `bin/${binCmd}`)
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
