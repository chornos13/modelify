#!/usr/bin/env node
const Crudify = require('./modules/Crudify')

const argv = require('yargs')
  .command('generate', 'Generate model for front-end', (yargs) => {
    Crudify.generateModelFrontend(yargs.argv.path)
  })
  .argv
