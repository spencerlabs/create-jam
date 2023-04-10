import { Arguments } from 'yargs'

import { binHandler } from '../lib'

export const command = 'react <project-directory> [commands..]'
export const description = 'Create React app'

export { builder } from '../lib'

export const handler = async (options: Arguments) =>
  binHandler(options, 'create-react-app')
