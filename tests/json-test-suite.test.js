'use strict'

/* global test, expect */

const fs = require('fs')
const path = require('path')

// If the git repo https://github.com/nst/JSONTestSuite is available
// as a peer directory of this repo, run the y- tests (tests that
// should be parseable)

const { parse } = require('../sloppy-json')

test.skip('JSONTestSuite y- tests', () => {
  const jsonTestSuiteDir = path.resolve(__dirname, '..', '..', 'JSONTestSuite', 'test_parsing')

  try {
    var entries = fs.readdirSync(jsonTestSuiteDir)
  } catch (err) {
    console.log(`JSONTestSuite not found and so these tests are ignored`)
  }

  entries = entries.filter(entry => entry.startsWith('y_'))

  let failed = 0
  for (const entry of entries) {
    const testJSON = fs.readFileSync(path.resolve(jsonTestSuiteDir, entry), 'utf8')

    let parsed
    try {
      parsed = JSON.stringify(parse(testJSON))
    } catch (err) {
      parsed = `error: ${err.message}`
      failed++
    }

    console.log('test:  ', testJSON)
    console.log('result:', parsed)
    console.log('')
  }

  expect(failed).toBe(0)
})
