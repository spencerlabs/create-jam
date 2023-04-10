import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { name, version } from '../package.json'

import * as astroCommand from './commands/astro'
import * as defaultCommand from './commands/default'
import * as docusaurusCommand from './commands/docusaurus'
import * as nextCommand from './commands/next'
import * as nuxtCommand from './commands/nuxt'
import * as reactCommand from './commands/react'
import * as redwoodCommand from './commands/redwood'
import * as remixCommand from './commands/remix'
import * as viteCommand from './commands/vite'

const pkgName = name.replace('create-', '')

yargs(hideBin(process.argv))
  .scriptName(name)
  .version(version)
  .example(
    `yarn create ${pkgName} react`,
    'Create a new JAMstack app with create-react-app'
  )
  .demandCommand()
  .strict()
  // commands
  .command(defaultCommand)
  .command(astroCommand)
  .command(docusaurusCommand)
  .command(nextCommand)
  .command(nuxtCommand)
  .command(reactCommand)
  .command(redwoodCommand)
  .command(remixCommand)
  .command(viteCommand)
  .parse()
