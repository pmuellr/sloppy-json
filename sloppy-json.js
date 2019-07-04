#!/usr/bin/env node

'use strict'

module.exports = {
  parse,
  stringify
}

const { createTokenizer } = require('./lib/tokenizer')

/** @typedef { import('./lib/types').IToken } IToken */
/** @typedef { import('./lib/types').ITokenizer } ITokenizer */

/** @type {(string: string) => any} */
function parse (string) {
  const tokenizer = createTokenizer(string)
  const token = tokenizer.next()
  if (token == null) throw new Error('no value found in string')

  return parseValue(tokenizer, token)
}

/** @type {(tokenizer: ITokenizer, token: IToken) => any} */
function parseValue (tokenizer, token) {
  if (token.isBraceL) return parseObject(tokenizer)
  if (token.isBracketL) return parseArray(tokenizer)
  if (token.isNull) return null
  if (token.isTrue) return true
  if (token.isFalse) return false
  if (token.isNumber) return token.value
  if (token.isString) return token.value

  throw new Error(`unexpected token: /${token.value}/`)
}

/** @type {(tokenizer: ITokenizer) => object} */
function parseObject (tokenizer) {
  const result = {}

  while (true) {
    let token = tokenizer.next()
    if (token == null) throw new Error('unterminated object')
    if (token.isBraceR) return result

    const key = parseValue(tokenizer, token)
    if (!(typeof key === 'string')) throw new Error(`object property name is not a string: ${key}`)

    token = tokenizer.next()
    if (token == null) throw new Error('unterminated object')
    if (!token.isColon) throw new Error(`missing colon after property name: ${key}`)

    token = tokenizer.next()
    if (token == null) throw new Error('unterminated object')

    const val = parseValue(tokenizer, token)

    result[key] = val
  }
}

/** @type {(tokenizer: ITokenizer) => any[]} */
function parseArray (tokenizer) {
  const result = []

  while (true) {
    const token = tokenizer.next()
    if (token == null) { throw new Error('unterminated array') }
    if (token.isBracketR) return result

    const value = parseValue(tokenizer, token)
    result.push(value)
  }
}

/** @type {(object: object, ignored: any, indent: number) => string} */
function stringify (object, ignored, indent) {
  throw new Error('not yet implemented')
}

// @ts-ignore urggghh ... this is so wrong!
if (require.main === module) main()

function main () {
  test('null')
  test('true')
  test('false')
  test('1234')
  test('"foo"')
  test('{a:b c:d}')
  test('[1 2 3]')
}

function test (string) {
  let value

  console.log('')
  console.log(`input: ${string}`)

  try {
    value = parse(string)
  } catch (err) {
    console.log(`error: ${err.message}`)
    return
  }

  console.log(`parse: ${JSON.stringify(value)}`)
}
