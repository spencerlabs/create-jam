import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'vite [commands..]'
export const description = 'Create Vite app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-vite')
