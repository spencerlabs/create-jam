const fs = require('fs')
const path = require('path')

const template = process.argv[2]

// Make sure an app template type is provided
if (!template) throw new Error('No template provided')

const dir = path.join(__dirname, '../templates', template)
const commonFolder = path.join(dir, '_common')

const singleTemplate = fs.existsSync(path.resolve(dir, 'package.json'))

if (singleTemplate) {
  console.log('Only one template found')
  process.exit(0)
}

// App templates
const subTemplates = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((t) => t.isDirectory() && t.name !== '_common')

// No need to run this if only one template
if (subTemplates.length === 1) process.exit(0)

// Get list of all file paths in directory
const getDirFiles = (directory, arr, splitDir) => {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((f) => {
    const absolute = path.join(directory, f.name)

    if (f.isDirectory()) return getDirFiles(absolute, arr, splitDir)

    arr.push(absolute.split(`/templates/${template}/${splitDir}/`)[1])
  })
}

// get dir files and return array of them
const dirFiles = (directory, splitDir) => {
  const arr = []

  getDirFiles(directory, arr, splitDir)

  return arr
}

// Files that have the same name
let commonFiles = []

// Find files with the same name
for (let i = 0; i < subTemplates.length; i++) {
  const subTemplate = subTemplates[i].name
  const subTempPath = path.join(dir, subTemplate)

  const files = dirFiles(subTempPath, subTemplate)

  if (i === 0) {
    commonFiles = files
  } else {
    commonFiles = commonFiles.filter((f) => files.indexOf(f) !== -1)
  }
}

// Files that have the same name and content
const commonContent = []

// Find files with the same name and content
if (commonFiles.length > 0) {
  for (let i = 0; i < commonFiles.length; i++) {
    const filePath = commonFiles[i]

    const basePath = path.join(dir, subTemplates[0].name, filePath)

    const otherTemplates = [...subTemplates]
    otherTemplates.shift()

    let same = true

    for (let j = 0; j < otherTemplates.length; j++) {
      if (!same) break

      const subTemplateName = otherTemplates[j].name

      const otherPath = path.join(dir, subTemplateName, filePath)

      const baseContents = fs.readFileSync(basePath)
      const otherContents = fs.readFileSync(otherPath)

      if (!baseContents.equals(otherContents)) same = false
    }

    if (same) commonContent.push(filePath)
  }
}

if (commonContent.length > 0) {
  if (fs.existsSync(commonFolder)) {
    fs.rmSync(commonFolder, { recursive: true, force: true })
  }

  fs.mkdirSync(commonFolder, { recursive: true })

  const firstTemplate = path.join(dir, subTemplates[0].name)

  // Copy common files to '_common' folder and remove from templates
  for (let i = 0; i < commonContent.length; i++) {
    const file = commonContent[i]

    if (file === 'yarn.lock' && !commonContent.includes('package.json'))
      continue

    const fileTempPath = path.join(firstTemplate, file)
    const newTempPath = path.join(commonFolder, file)

    const subDirs = file.split('/')

    if (subDirs.length > 1) {
      subDirs.pop()

      const subDirPath = path.join(commonFolder, subDirs.join('/'))

      fs.mkdirSync(subDirPath, { recursive: true })
    }

    fs.copyFileSync(fileTempPath, newTempPath)

    // Remove common files from templates
    for (let j = 0; j < subTemplates.length; j++) {
      const subTemplate = subTemplates[j].name

      const fileToRemove = path.join(dir, subTemplate, file)

      if (fs.existsSync(fileToRemove)) {
        fs.rmSync(fileToRemove, { recursive: true, force: true })
      }
    }
  }
}
