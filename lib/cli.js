#!/usr/bin/env node

'use strict'

module.exports = { main }

const readline = require('readline')

const sloppyJSON = require('../sloppy-json')

const pkg = require('../package.json')
const PROGRAM = pkg.name
const VERSION = pkg.version

// @ts-ignore urggghh ... this is so wrong!
if (require.main === module) main()

async function main () {
  const [ option, value ] = process.argv.slice(2)

  if (option === '-d') decode(value || await readStdin())
  if (option === '-D') decode(value || await readStdin(), { indent: 4 })
  if (option === '-e') encode(value || await readStdin())
  if (option === '-E') encode(value || await readStdin(), { indent: 4 })
  if (option === '-v') version()
  help()
}

function decode (value, options = {}) {
  try {
    value = sloppyJSON.parse(value)
  } catch (err) {
    logError(err.message)
  }

  if (options.indent) returnResult(JSON.stringify(value, null, options.indent))
  returnResult(JSON.stringify(value))
}

function encode (value, options = {}) {
  try {
    value = sloppyJSON.parse(value)
  } catch (err) {
    logError(err.message)
  }

  if (options.indent) returnResult(sloppyJSON.stringify(value, null, options.indent))
  returnResult(sloppyJSON.stringify(value))
}

function returnResult (value) {
  console.log(value)
  process.exit(0)
}

function logError (message) {
  console.log(PROGRAM, 'error:', message)
  process.exit(1)
}

async function readStdin () {
  const deferred = createDeferred()

  const rl = readline.createInterface({ input: process.stdin })

  const lines = []
  rl.on('SIGINT', () => process.exit())
  rl.on('line', (line) => lines.push(line))
  rl.on('close', () => {
    deferred.resolve(lines.join('\n'))
  })

  return deferred
}

function version () {
  console.log(VERSION)
  process.exit(0)
}

function help () {
  console.log(PROGRAM, VERSION)
  console.log('')
  console.log('usage:')
  console.log(`  ${PROGRAM} -d <value>  - decode the value`)
  console.log(`  ${PROGRAM} -D <value>  - decode the value indented`)
  console.log(`  ${PROGRAM} -e <value>  - encode the value`)
  console.log(`  ${PROGRAM} -E <value>  - encode the value indented`)
  console.log(`  ${PROGRAM} -h          - print this help`)
  console.log(`  ${PROGRAM} -v          - print the version`)
  console.log('')
  console.log('<value> should be a string to be encoded or decoded.  If it is not')
  console.log('provided the value will be read from stdin.')
  console.log('')
  console.log('Decoding will return a JSON respresentation of the sloppy JSON')
  console.log('passed as a parameter.')
  console.log('Encoding will return a sloopy JSON respresentation of the sloppy json')
  console.log('passed as a parameter.')
}

// a promise with built-in resolve() and reject() methods
function createDeferred () {
  let resolver
  let rejecter

  const promise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })

  promise.resolve = resolver
  promise.rejecter = rejecter

  return promise
}
