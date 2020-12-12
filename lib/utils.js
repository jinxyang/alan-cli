const fs = require('fs')

const chalk = require('chalk')
const download = require('download-git-repo')

exports.isEmpty = (dirname) => !fs.readdirSync(dirname).length

exports.log = {
  error(text) {
    console.log(chalk.red(`Error: ${text}`))
  },
  warning(text) {
    console.log(chalk.yellow(`Warning: ${text}`))
  },
  success(text) {
    console.log(chalk.green(`Success: ${text}`))
  },
}

exports.clone = (repository, destination) => {
  return new Promise((resolve) => {
    download(repository, destination, resolve)
  })
}

exports.delay = (func, time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      func()
      resolve()
    }, time)
  })
}
