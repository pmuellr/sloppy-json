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
  check('123_456', 123456)
  check('[`abc `def  `ghi ]', ['abc', 'def', 'ghi'])

  // from JSONTestSuite failures
  check('[null, 1, "1", {}]', [ null, 1, '1', {} ])
  check('[1,null,null,null,2]', [1, null, null, null, 2])
  check('{ "min": -1.0e+28, "max": 1.0e+28 }', { 'min': -1.0e+28, 'max': 1.0e+28 })

  function check (sloppy, object) {
    // console.log(`sloppy: /${sloppy}/`)
    const parsed = parse(sloppy)
    // console.log(`parsed: /${JSON.stringify(parsed)}/`)

    if (object != null && typeof object === 'object') {
      expect(parsed).toMatchObject(object)
    } else {
      expect(parsed).toEqual(object)
    }
  }
})
