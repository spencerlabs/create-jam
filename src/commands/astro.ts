import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'astro [commands..]'
export const description = 'Create Astro app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-astro')
