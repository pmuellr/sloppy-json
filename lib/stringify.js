'use strict'

module.exports = stringify

const PatternIdent = /^[A-Za-z_$][A-Za-z0-9_$]*$/

/** @type {(object: any, ignored?: any, indent?: number | string) => string} */
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
      if (object.length > 0) this._writer.indent()
      this._writer.writeNewLine()

      let current = 1
      for (let element of object) {
        this.stringize(element)
        if (current !== object.length) {
          this._writer.writeInlineSpace()
          this._writer.writeNewLine()
        }

        current++
      }

      if (object.length > 0) this._writer.dedent()
      if (object.length > 0) this._writer.writeNewLine()
      this._writer.write(']')

      return
    }

    const keys = Array.from(Object.keys(object))

    // must be an object
    this._writer.write('{')
    if (keys.length > 0) this._writer.indent()
    if (keys.length > 0) this._writer.writeNewLine()

    let current = 1
    for (let key of keys) {
      const val = object[key]

      this.stringize(key)
      this._writer.write(':')
      this._writer.writeVerboseSpace()
      this.stringize(val)

      if (current !== keys.length) {
        this._writer.writeInlineSpace()
        this._writer.writeNewLine()
      }

      current++
    }

    if (keys.length > 0) this._writer.dedent()
    if (keys.length > 0) this._writer.writeNewLine()
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

  writeVerboseSpace () {
    this.writeSpace()
  }

  writeNewLine () {
    this.write('\n')

    for (let indents = 0; indents < this._indentLevel; indents++) {
      this.write(this._indent)
    }
  }

  indent () {
    this._indentLevel++
  }

  dedent () {
    this._indentLevel--
  }
}

class NonIndentingWriter extends IndentingWriter {
  writeNewLine () {}
  writeInlineSpace () { this.write(' ') }
  writeVerboseSpace () {}
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
  check({ a: { b: 2, c: 3 } })
}

function check (object) {
  console.log('object:    ', JSON.stringify(object))
  console.log('non-indent:', stringify(object, null, 0))
  console.log('indent:')
  console.log(stringify(object, null, 4))
  console.log('')
}

/*

{a: {b: c d: {}}}

{
  a: {
    b: c
    d: {
    }
    e: {
      a: b
    }
  }
}

[[]]
*/
