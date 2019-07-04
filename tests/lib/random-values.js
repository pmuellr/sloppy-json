'use strict'

// builds random values

module.exports = { create }

const { choose, chooseEqually, randomInteger } = require('./random')

const MAX_DEPTH = 3

function create (depth = 0) {
  const creator = choose([
    [ 1, createNull ],
    [ 1, createBoolean ],
    [ 1, createNumber ],
    [ 5, createString ],
    [ 5, createObject ],
    [ 5, createArray ]
  ])

  return creator(depth)
}

function createNull () {
  return null
}

function createBoolean () {
  const value = chooseEqually(true, false)
  return value
}

function createNumber () {
  const buffer = []

  // generate leading minus sign
  buffer.push(chooseEqually('', '-'))

  // generate some integer digits
  buffer.push(generateInteger(1000))

  let value
  // generate fraction?
  if (createBoolean()) {
    value = parseInt(buffer.join(''))
    if (value === 0) return 0
  } else {
    buffer.push('.')
    buffer.push(generateInteger(999))

    // generate exponent?
    if (createBoolean()) {
      buffer.push(chooseEqually('e', 'E'))
      buffer.push(chooseEqually('', '-', '+'))
      buffer.push(generateInteger(99))
    }
    value = parseFloat(buffer.join(''))
  }

  return value
}

function createString () {
  const buffer = []
  const length = chooseEqually(0, 1, 2, 3)

  for (let i = 0; i < length; i++) {
    buffer.push(choose(STRING_CHARS_CHOICE))
  }

  return buffer.join('')
}

function createObject (depth) {
  const result = {}

  if (depth >= MAX_DEPTH) return result

  const length = chooseEqually(0, 1, 2, 3)
  for (let i = 0; i < length; i++) {
    const key = createString()
    const val = create(depth + 1)
    result[key] = val
  }

  return result
}

function createArray (depth) {
  const result = []

  if (depth > MAX_DEPTH) return result

  const length = chooseEqually(0, 1, 2, 3)
  for (let i = 0; i < length; i++) {
    const val = create(depth + 1)
    result.push(val)
  }

  return result
}

function generateInteger (n = 1000) {
  return randomInteger(n) // 0..n-1
}
const STRING_CHARS_CHOICE = [
  [ 10, 'x' ],
  [ 10, 'X' ],
  [ 5, '0' ],
  [ 5, '1' ],
  [ 3, '$' ],
  [ 3, '_' ],
  [ 2, ' ' ],
  [ 2, '\t' ],
  [ 2, '\n' ],
  [ 2, '.' ],
  [ 2, '+' ],
  [ 1, `'` ],
  [ 1, '"' ],
  [ 1, '`' ],
  [ 1, '😀' ]
]

// @ts-ignore urggghh ... this is so wrong!
if (require.main === module) {
  const { setRandoSeed } = require('./random')
  let [ seed = '.', length = '10' ] = process.argv.slice(2)

  if (seed === '.') seed = `${Date.now()}`
  setRandoSeed(seed)

  length = parseInt(length)
  if (isNaN(length)) length = 10

  for (let i = 0; i < length; i++) {
    console.log(JSON.stringify(create(), null, 4))
    console.log('')
  }
}
