import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'nuxt <project-directory> [commands..]'
export const description = 'Create Nuxt app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-nuxt-app')
