import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'remix [commands..]'
export const description = 'Create Remix app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-remix')
