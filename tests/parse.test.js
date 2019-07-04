'use strict'

/* global test, expect */

const { parse } = require('../sloppy-json')

test('simple tests', () => {
  check('[1 2 3]', [ 1, 2, 3 ])
  check('null', null)
  check('true', true)
  check('false', false)
  check('1234', 1234)
  check('"foo"', 'foo')
  check('{a:b c:d}', { a: 'b', c: 'd' })

  function check (sloppy, object) {
    console.log(`sloppy: /${sloppy}/`)
    const parsed = parse(sloppy)
    console.log(`parsed: /${JSON.stringify(parsed)}/`)

    if (object != null && typeof object === 'object') {
      expect(parsed).toMatchObject(object)
    } else {
      expect(parsed).toEqual(object)
    }
  }
})
