import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'docusaurus [commands..]'
export const description = 'Create Docusaurus app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-docusaurus')
