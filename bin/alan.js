#!/usr/bin/env node

const { Command } = require('commander')
const pkg = require('../package')

const create = require('../lib/create')
const dev = require('../lib/dev')
const build = require('../lib/build')

const program = new Command()
program.version(`${pkg.name} ${pkg.version}`, '-v, --version')

program
  .command('create [project-name]')
  .description('create a new project')
  .action(create)

program.command('dev').description('start development server').action(dev)
program.command('build').description('bundle pack').action(build)

program.parse(process.argv)
