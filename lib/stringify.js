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

  return new StringIzer(indent).stringize(object)
}

class StringIzer {
  /** @type {(object: any, indent?: string) => string} */
  constructor (indent) {
    this._indentText = indent
    this._indentLevel = 0
    this._result = []
  }

  stringize (object) {
    if (object == null) return 'null'

    if (typeof object === 'number') return this._stringizeNumber(object)
    if (typeof object === 'boolean') return this._stringizeBoolean(object)
    if (typeof object === 'string') return this._stringizeString(object)

    if (Array.isArray(object)) return this._stringizeArray(object)
    return this._stringizeObject(object)
  }

  _stringizeNumber (object) {
    return JSON.stringify(object)
  }

  _stringizeBoolean (object) {
    return JSON.stringify(object)
  }

  _stringizeString (object) {
    if (PatternIdent.test(object)) return object
    return JSON.stringify(object)
  }

  _stringizeObject (object) {
  }

  _stringizeArray (object) {
  }

  _newLine () {
    if (this._indentText == null) return
    this._result.push('\n')
    this._result.push(this._indentText)
  }

  _indent () {
    this._indentLevel++
  }

  _dedent () {
    this._indentLevel--
  }
}
