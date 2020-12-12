const fs = require('fs')
const validate = require('validate-npm-package-name')
const execa = require('execa')
const ora = require('ora')

const { isEmpty, log, clone } = require('./utils')

module.exports = async (name) => {
  const isCurrentDir = !name || name === '.'
  const projectDir = isCurrentDir ? process.cwd() : `${process.cwd()}/${name}`
  const spinner = ora()

  if (!isCurrentDir) {
    if (fs.existsSync(projectDir)) {
      log.error(`"${projectDir}" already exists.`)
      process.exit()
    }
    const { validForNewPackages, errors, warnings } = validate(name)
    if (!validForNewPackages) {
      if (errors) errors.forEach(log.error)
      if (warnings) warnings.forEach(log.warning)
      process.exit()
    }
    fs.mkdirSync(projectDir)
  } else if (!isEmpty(projectDir)) {
    log.error(`"${projectDir}" is not empty.`)
    process.exit()
  }

  spinner.start('Downloading template')
  const cloneError = await clone('jinxyang/webpack5#develop', projectDir)
  if (cloneError) {
    log.error('Fail to download template, please try again.')
    spinner.stop()
    process.exit()
  }
  spinner.succeed('Template downloaded.')
  spinner.start('Installing dependencies')
  try {
    await execa('npm', ['install'], { cwd: projectDir })
    spinner.succeed('Dependencies installed.')
  } catch (error) {
    spinner.stop()
    console.log(error)
    process.exit()
  }
}
