'use strict'

/* global test, expect */

const { stringify } = require('../sloppy-json')

test('basic tests', () => {
  check('[1 2 3]', [ 1, 2, 3 ])
  check('null', null)
  check('true', true)
  check('false', false)
  check('1234', 1234)
  check('foo', 'foo')
  check('{a:b c:d}', { a: 'b', c: 'd' })
  check('123456', 123456)
  check('[abc def ghi]', ['abc', 'def', 'ghi'])

  function check (sloppy, object) {
    // console.log(`sloppy: /${sloppy}/`)
    const generated = stringify(object)
    expect(generated).toEqual(sloppy)
  }
})

test.skip('failing basic tests', () => {
  check('""\\"foo\\"""', "'foo'")
  check('""\\"foo\\"""', '"foo"')

  function check (sloppy, object) {
    // console.log(`sloppy: /${sloppy}/`)
    const generated = stringify(object)
    expect(generated).toEqual(sloppy)
  }
})
