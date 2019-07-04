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

const PatternIdentStart = /[A-Za-z_$]/
const PatternIdentRest = /[A-Za-z0-9_$]/
const PatternNumberStart = /[0-9+\-_]/
const PatternNumberRest = /[0-9+\-._Ee]/
const PatternWhiteSpace = /[\s,]/

class Tokenizer {
  constructor (string) {
    this._chars = string.split('')
    this._index = 0
    this._c = this._chars[0]
  }

  // return the next token
  /** @type {() => Token} */
  next () {
    this._skipWhiteSpace()

    if (this._c === '') return null

    switch (this._c) {
      case '{': this._nextC(); return new TokenBraceL('{')
      case '}': this._nextC(); return new TokenBraceR('}')
      case '[': this._nextC(); return new TokenBracketL('[')
      case ']': this._nextC(); return new TokenBracketR(']')
      case ':': this._nextC(); return new TokenColon(':')

      case `'`:
      case `"`:
        return new TokenString(this._readString())

      case '`':
        return new TokenString(this._readBackTickString())
    }

    // +, -, or a digit
    if (PatternNumberStart.test(this._c)) {
      return new TokenNumber(this._readNumber())
    }

    // $, _, or an alpha
    if (PatternIdentStart.test(this._c)) {
      const ident = this._readIdent()
      switch (ident) {
        case 'true': return new TokenTrue(true)
        case 'false': return new TokenFalse(false)
        case 'null': return new TokenNull(null)
      }

      return new TokenString(ident)
    }

    throw new Error(this._getErrorMessage(`unexpected character "${this._c}"`))
  }

  // read a string
  /** @type {() => string} */
  _readString () {
    const buffer = []
    const delim = this._c
    this._nextC()

    while (this._c !== null) {
      // the end delimiter
      if (this._c === delim) {
        this._nextC()
        const valueString = `"${buffer.join('')}"`

        try {
          return JSON.parse(valueString)
        } catch (err) {
          throw new Error(this._getErrorMessage(`invalid string value: /${valueString}/`))
        }
      }

      // double quote - need to escape it
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

      // processing a \ escape - just deal with the following character;
      // other forms like `\uXXXX` don't have "interesting" chars in them,
      // so we'll just treat XXXX like typical character when added to the
      // buffer, which will get interpreted correctly by JSON.parse()
      buffer.push('\\')
      this._nextC()
      buffer.push(this._c)
      this._nextC()
    }
  }

  _readBackTickString () {
    const buffer = []
    this._nextC()

    while (this._c !== '' && !/\s/.test(this._c)) {
      buffer.push(this._c)
      this._nextC()
    }

    return buffer.join('')
  }

  // read a number
  /** @type {() => number} */
  _readNumber () {
    const buffer = []

    while (PatternNumberRest.test(this._c)) {
      if (this._c !== '_') buffer.push(this._c)
      this._nextC()
    }

    const valueString = buffer.join('')

    let value
    try {
      value = JSON.parse(valueString)
    } catch (err) {
      throw new Error(this._getErrorMessage(`invalid number value: /${valueString}/`))
    }

    if (typeof value !== 'number') {
      throw new Error(this._getErrorMessage(`invalid number value: /${valueString}/, is a ${typeof value}`))
    }

    return value
  }

  // read an identifier
  /** @type {() => string} */
  _readIdent () {
    const buffer = []

    while (PatternIdentRest.test(this._c)) {
      buffer.push(this._c)
      this._nextC()
    }

    return buffer.join('')
  }

  // skip over whitespace
  _skipWhiteSpace () {
    while (true) {
      if (PatternWhiteSpace.test(this._c)) {
        this._nextC()
        continue
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

        throw new Error(this._getErrorMessage(`unexpected "/"`))
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

  _getErrorMessage (message) {
    return `near index ${this._index}: ${message}`
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
