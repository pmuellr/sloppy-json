'use strict'

module.exports = { stringify }

const PatternIdent = /^([A-Za-z]_\$)([A-Za-z0-9]_\$)*/

/** @type {(object: any, ignored: any, indent: number | string) => string} */
function stringify (object, ignored, indent) {
  if (indent == null) indent = 0
  if (typeof indent === 'number') {
    if (indent === 0) {
      indent = null
    } else {
      indent = ''.padEnd(indent, ' ')
    }
  } else if (typeof indent !== 'string') {
    throw new Error(`invalid indent value: ${indent}`)
  }

  const stringIzer = new StringIzer(indent)
  stringIzer.stringize(object)
  return stringIzer.getResult()
}

class StringIzer {
  /** @type {(object: any, indent?: string) => string} */
  constructor (indent) {
    if (indent == null) {
      this._writer = new NonIndentingWriter()
    } else {
      this._writer = new IndentingWriter(indent)
    }
  }

  getResult () {
    return this._writer.getResult()
  }

  stringize (object) {
    if (object == null) return this._writer.write('null')

    if (typeof object === 'number') {
      this._writer.write(`${object}`)
      return
    }

    if (typeof object === 'boolean') {
      this._writer.write(`${object}`)
      return
    }

    if (typeof object === 'string') {
      if (PatternIdent.test(object)) {
        this._writer.write(object)
      } else {
        this._writer.write(`${JSON.stringify(object)}`)
      }
      return
    }

    if (Array.isArray(object)) {
      this._writer.write('[')
      this._writer.indent()

      let first = true
      for (let element of object) {
        if (!first) this._writer.writeInlineSpace()
        if (first) first = false

        this._writer.writeNewLine()
        this.stringize(element)
      }

      this._writer.dedent()
      this._writer.writeNewLine()
      this._writer.write(']')

      return
    }

    this._writer.write('{')
    this._writer.indent()

    let first = true
    for (let key in object) {
      if (!first) this._writer.writeInlineSpace()
      if (first) first = false

      const val = object[key]

      this._writer.writeNewLine()
      this.stringize(key)
      this._writer.write(':')
      this._writer.writeInlineSpace()
      this._writer.writeSpace()
      this.stringize(val)
    }

    this._writer.dedent()
    this._writer.writeNewLine()
    this._writer.write('}')
  }
}

class IndentingWriter {
  constructor (indent) {
    this._indent = indent
    this._indentLevel = 0
    this._result = []
  }

  getResult () {
    return this._result.join('')
  }

  write (string) {
    this._result.push(string)
  }

  writeSpace () {
    this.write(' ')
  }

  writeInlineSpace () {}

  writeNewLine () {
    this.write('\n')

    for (let indents = 0; indents < this._indentLevel; indents++) {
      this.write(this._indent)
    }
  }

  indent () {
    this.indentLevel++
  }

  dedent () {
    this.indentLevel--
  }
}

class NonIndentingWriter extends IndentingWriter {
  writeSpace () {}
  writeNewLine () {}
  writeInlineSpace () { this.write(' ') }
}

// @ts-ignore urggghh ... this is so wrong!
if (require.main === module) main()

function main () {
  check(null)
  check(1)
  check(true)
  check('abc')
  check('a b c')
  check([[1, 2, 3]])
  check({ a: { b: 2 } })
}

function check (object) {
  console.log('object:', JSON.stringify(object))
  console.log('string:', stringify(object))
  console.log('indent:', stringify(object, null, 4))
  console.log('')
}
