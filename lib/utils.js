'use strict'

const path = require('path')

module.exports = {
  isRootPath,
  resolvePath,
  createDeferred
}

/** @type {(spec: string) => boolean} */
function isRootPath (spec) {
  if (spec.startsWith('/')) return true
  if (spec.match(/^.:/)) return true

  return false
}

/** @type {(base: string, spec: string) => string} */
function resolvePath (base, spec) {
  if (isRootPath(spec)) return spec

  return path.resolve(base, spec)
}

/** @type {() => {promise: Promise, resolve: (value)=>void, reject: (eror)=>void}} */
function createDeferred () {
  let resolver
  let rejecter

  const promise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })

  return {
    promise,
    resolve: resolver,
    reject: rejecter
  }
}

// @ts-ignore
if (require.main === module) test()

async function test () {
  const deferred = createDeferred()
  setTimeout(deferred.resolve, 2000)
  console.log('waiting')
  await deferred.promise
  console.log('waited')
}
