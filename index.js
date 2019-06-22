#!/usr/bin/env node
const Crudify = require('./modules/Crudify')

const argv = require('yargs')
  .command('generate', 'Generate model for front-end', (yargs) => {
    Crudify.generateModelFrontend(yargs.argv.path)
  })
  .argv


if (argv.ships > 3 && argv.distance < 53.5) {
  console.log('Plunder more riffiwobbles!')
} else {
  console.log('Retreat from the xupptumblers!')
}
