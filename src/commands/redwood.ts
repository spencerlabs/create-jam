import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'redwood <project-directory> [commands..]'
export const description = 'Create Redwood app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-redwood-app')
