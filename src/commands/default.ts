import fs from 'node:fs'
import path from 'node:path'

import prompts from 'prompts'
import { Arguments } from 'yargs'

export const command = '$0'
export const description = 'Pick an app framework'

export { builder } from '../lib'

export const handler = async (options: Arguments) => {
  const frameworks = fs
    .readdirSync(path.join(__dirname), {
      withFileTypes: true,
    })
    .filter((file) => {
      const exclude = ['default', 'binHandler']

      const fileName = path.parse(file.name).name

      if (exclude.includes(fileName)) return false

      if (fileName.endsWith('.d')) return false

      return true
    })
    .map((file) => {
      const frameworkName = path.parse(file.name).name
      return { title: frameworkName, value: frameworkName }
    })

  const { framework } = await prompts({
    type: 'select',
    name: 'framework',
    message: 'Choose a framework',
    choices: frameworks,
    validate: (value) => {
      if (!value) return 'You must choose a framework'
      return true
    },
  })

  const projNameFrameworks = ['nuxt', 'react', 'redwood']

  if (projNameFrameworks.includes(framework)) {
    const response = await prompts({
      type: 'text',
      name: 'project',
      message: 'Project directory?',
      validate: (value) => {
        if (!value)
          return `You must defined a project directory for ${framework}`
        return true
      },
    })

    if (options.commands && Array.isArray(options.commands)) {
      options.commands.push(response.project)
    } else if (!options.commands) {
      options.commands = [response.project]
    }
  }

  const frameworkHandler = await import(`./${framework}`)

  await frameworkHandler.handler(options)
}
