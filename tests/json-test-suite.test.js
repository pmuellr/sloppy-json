'use strict'

/* global test */

const fs = require('fs')
const path = require('path')

// If the git repo https://github.com/nst/JSONTestSuite is available
// as a peer directory of this repo, run the y- tests (tests that
// should be parseable)

const { parse } = require('../sloppy-json')

test('JSONTestSuite y- tests', () => {
  const jsonTestSuiteDir = path.resolve(__dirname, '..', '..', 'JSONTestSuite', 'test_parsing')

  try {
    var entries = fs.readdirSync(jsonTestSuiteDir)
  } catch (err) {
    console.log(`JSONTestSuite not found and so these tests are ignored`)
    return
  }

  entries = entries.filter(entry => entry.startsWith('y_'))

  for (const entry of entries) {
    const testJSON = fs.readFileSync(path.resolve(jsonTestSuiteDir, entry), 'utf8')

    JSON.stringify(parse(testJSON))
  }
})
