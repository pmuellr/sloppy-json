#!/usr/bin/env node

'use strict'

// calls dependency-check in the current directory

const path = require('path')

const childProcess = require('child_process')

const utils = require('../lib/utils')

const DependencyCheckScript = path.resolve(
  path.join(__dirname, '..', 'node_modules', '.bin', 'dependency-check')
)

if (require.main === module) main()

async function main () {
  console.log('checking dependencies in', process.cwd())

  try {
    var pkgJson = require(`${process.cwd()}/package.json`)
  } catch (err) {
    console.log(`package.json not found in ${process.cwd()}`)
    process.exit(1)
  }

  let depsCheckResult

  depsCheckResult = await depsCheck('missing', pkgJson)
  const codeMissing = depsCheckResult.error != null

  depsCheckResult = await depsCheck('unused', pkgJson)
  const codeUnused = depsCheckResult.error != null

  console.log('')

  if (codeMissing || codeUnused) process.exit(1)
}

async function depsCheck (type, pkgJson) {
  let args

  if (type === 'missing') {
    args = '--missing'
  } else if (type === 'unused') {
    args = '--unused --no-dev'
  } else {
    throw new Error('depsCheck() only supports args "missing" or  "ignored"')
  }

  const depsCheckProps = pkgJson['deps-check'] || {}
  const typeProps = depsCheckProps[type] || {}
  const ignore = typeProps['ignore']

  if (ignore != null) {
    args = `${args} --ignore-module ${ignore}`
  }

  const deferred = utils.createDeferred()

  childProcess.exec(`${DependencyCheckScript} ${args} .`, (error, stdout, stderr) => {
    stdout = stdout.trim()
    stderr = stderr.trim()
    if (stdout !== '') console.log(stdout)
    if (stderr !== '') console.log(stderr)

    deferred.resolve({ error, stdout, stderr })
  })

  return deferred.promise
}
