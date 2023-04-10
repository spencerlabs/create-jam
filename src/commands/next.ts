import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'next [commands..]'
export const description = 'Create Next app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-next-app')
