/**
 * @file helper
 */

const nps = require('path')
const fs = require('fs')

function fixture() {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat([].slice.call(arguments)))
}

function read(name) {
  return fs.readFileSync(fixture(name), { encoding: 'utf8' })
}

module.exports = {
  fixture,
  read
}
