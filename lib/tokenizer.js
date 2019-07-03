'use strict'

// trying to follow https://tools.ietf.org/html/rfc8259

module.exports = { createTokenizer }

/** @typedef { import('./types').IToken } IToken */
/** @typedef { import('./types').ITokenizer } ITokenizer */

// create a tokenizer from a string
/** @type {(string: string) => ITokenizer} */
function createTokenizer (string) {
  return new Tokenizer(string)
}

class Tokenizer {
  constructor (string) {
    this._chars = string.split('')
    this._index = -1
    this._c = ''
  }

  // return the next token
  /** @type {() => Token} */
  next () {
    this._skipWhiteSpace()

    if (this._c === '') return null

    switch (this._c) {
      case '{': return new TokenBraceL('{')
      case '}': return new TokenBraceR('}')
      case '[': return new TokenBracketL(']')
      case ']': return new TokenBracketR(']')
      case ':': return new TokenColon(':')

      case `'`:
      case `"`:
      case '`':
        return new TokenString(this._readString())
    }

    // +, -, or a digit
    if (this._c.match(/\+|-|\d/)) {
      return new TokenNumber(this._readNumber())
    }

    // $, _, or an alpha
    if (this._c.match(/\$|_|[A-Za-z]/)) {
      const ident = this._readIdent()
      switch (ident) {
        case 'true': return new TokenTrue(true)
        case 'false': return new TokenFalse(false)
        case 'null': return new TokenNull(null)
      }

      return new TokenString(ident)
    }

    throw new Error(`unexpected character "${this._c} at index ${this._index}`)
  }

  // read a string
  /** @type {() => string} */
  _readString () {
    const buffer = []
    const delim = this._c
    this._nextC()

    // cheating, doesn't support escaped delimiter, eg "a\"b"
    while (this._c !== null) {
      // the end delimiter
      if (this._c === delim) {
        this._nextC()
        const valueString = `"${buffer.join('')}"`

        try {
          return JSON.parse(valueString)
        } catch (err) {
          throw new Error(`invalid string value: /${valueString}/`)
        }
      }

      // double quote
      if (this._c === '"') {
        buffer.push('\\')
        buffer.push('"')
        this._nextC()
        continue
      }

      // not a \
      if (this._c !== '\\') {
        buffer.push(this._c)
        this._nextC()
        continue
      }

      // a /
      this._nextC()

      // not \u
      if (this._c !== 'u') {
        buffer.push('\\')
        buffer.push(this._c)
        this._nextC()
        continue
      }

      // \uXXXX
      buffer.push('\\')
      buffer.push('u')
      this._nextC(); buffer.push(this._c)
      this._nextC(); buffer.push(this._c)
      this._nextC(); buffer.push(this._c)
      this._nextC(); buffer.push(this._c)
      continue
    }
  }

  // read a number
  /** @type {() => number} */
  _readNumber () {
    const buffer = []

    while (this._c.match(/\+|-|\d|\.|e|E/)) {
      buffer.push(this._c)
      this._nextC()
    }

    const valueString = buffer.join('')

    let value
    try {
      value = JSON.parse(valueString)
    } catch (err) {
      throw new Error(`invalid number value: /${valueString}/`)
    }

    if (typeof value !== 'number') {
      throw new Error(`invalid number value: /${valueString}/, is a ${typeof value}`)
    }

    return value
  }

  // read an identifier
  /** @type {() => string} */
  _readIdent () {
    const buffer = []

    while (this._c.match(this._c.match(/\$|\w/))) {
      buffer.push(this._c)
      this._nextC()
    }

    return buffer.join('')
  }

  // skip over whitespace
  _skipWhiteSpace () {
    while (true) {
      this._nextC()

      switch (this._c) {
        case ',': // hehe
        case ' ':
        case '\n ':
        case '\r':
        case '\t': continue
      }

      if (this._c === '#') {
        this._skipToEndOfLine()
        continue
      }

      if (this._c === '/') {
        this._nextC()
        if (this._c === '/') {
          this._skipToEndOfLine()
          continue
        }

        throw new Error(`expecting "/" at position ${this._index}`)
      }

      return
    }
  }

  // skip to the end of the line
  _skipToEndOfLine () {
    while (this._c !== '\n' && this._c !== `\r` && this._c !== null) {
      this._nextC()
    }
  }

  // update `_c` and `_index` to get the next characer
  _nextC () {
    this._index++

    if (this._index >= this._chars.length) {
      this._c = ''
      return
    }

    this._c = this._chars[this._index]
  }
}

class Token {
  constructor (value) {
    this.value = value
  }

  get isEOF () { return false }
  get isBraceL () { return false }
  get isBraceR () { return false }
  get isBracketL () { return false }
  get isBracketR () { return false }
  get isColon () { return false }
  get isString () { return false }
  get isNumber () { return false }
  get isTrue () { return false }
  get isFalse () { return false }
  get isNull () { return false }
}

class TokenBraceL extends Token { get isBraceL () { return true } }
class TokenBraceR extends Token { get isBraceR () { return true } }
class TokenBracketL extends Token { get isBracketL () { return true } }
class TokenBracketR extends Token { get isBracketR () { return true } }
class TokenColon extends Token { get isColon () { return true } }
class TokenString extends Token { get isString () { return true } }
class TokenNumber extends Token { get isNumber () { return true } }
class TokenTrue extends Token { get isTrue () { return true } }
class TokenFalse extends Token { get isFalse () { return true } }
class TokenNull extends Token { get isNull () { return true } }
