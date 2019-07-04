'use strict'

/* global test, expect */

const { stringify } = require('../sloppy-json')

test('throws when commands is missing', () => {
  function run () {
    stringify('{}')
  }

  expect(run).toThrow(/not yet implemented/)
})
