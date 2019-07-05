'use strict'

// builds sloppy json string versions of random values

module.exports = { create }

const random = require('./random')
const randomValues = require('./random-values')

/** return a sloppy rendition of a randomly generated object */
/** @returns {{object: any, sloppy: string}} */
function create () {
  const object = randomValues.create()
  const sloppy = sloppyStringifyWithWs(object)

  return { object, sloppy }
}

function sloppyStringifyWithWs (object) {
  return `${ws()}${sloppyStringify(object)}${ws()}`
}

function sloppyStringify (object) {
  if (object === null) return 'null'
  if (typeof object === 'number') return sloppyNumber(object)
  if (typeof object === 'string') return sloppyString(object)
  if (typeof object === 'boolean') return `${object}`
  if (Array.isArray(object)) return sloppyArray(object)
  return sloppyObject(object)
}

function sloppyNumber (object) {
  const string = JSON.stringify(object)
  const chars = string.split('')
  const underscores = random.randomInteger(3) // 0..2

  for (let i = 0; i < underscores; i++) {
    const index = random.randomInteger(chars.length) + 1
    chars.splice(index, 0, '_')
  }

  return chars.join('')
}

function sloppyString (object) {
  if (object.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/)) {
    return object
  }

  const jsonObject = JSON.stringify(object)

  // generate single quote, double quote, and back-tick strings
  switch (random.randomInteger(3)) {
    case 0:
      const jsonObjectUnquoted = jsonObject.substring(1, jsonObject.length - 1)
      return `'${jsonObjectUnquoted.replace(/'/g, `\\'`)}'`
    case 1:
      return `${jsonObject}${ws()}`
    case 2:
      if (object.split(/\s/).length !== 1) return jsonObject
      let w = ws()
      if (w === '') w = ' '
      return '`' + object + w
  }

  throw new Error('woops')
}

function sloppyArray (object) {
  const buffer = []
  buffer.push(ws())
  buffer.push('[')

  for (let element of object) {
    buffer.push(ws())
    buffer.push(sloppyStringify(element))
    buffer.push(ws())
    buffer.push(comma())
    buffer.push(ws())
  }

  buffer.push(']')
  buffer.push(ws())
  return buffer.join('')
}

function sloppyObject (object) {
  return JSON.stringify(object)
}

function comma () {
  return random.chooseEqually('', ',')
}

function ws () {
  const buffer = []
  const length = random.choose([ [5, 0], [4, 1], [1, 2] ])

  for (let i = 0; i < length; i++) {
    buffer.push(random.chooseEqually('', ' ', '\n', '\t', '\f'))
  }

  return buffer.join('')
}
