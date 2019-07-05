'use strict'

/* global test, expect */

const random = require('./lib/random')
const randomValues = require('./lib/random-values')
const randomSloppyStrings = require('./lib/random-sloppy-strings')

const { parse } = require('../sloppy-json')

const seed = process.env.RANDO_SEED || new Date().toISOString()
random.setRandoSeed(seed)
console.log(`rando seed: ${seed}`)

test('parsing random values', () => {
  const COUNT = 20000

  for (let i = 0; i < COUNT; i++) {
    const object = randomValues.create()
    const jsonLong = JSON.stringify(object, null, 4)
    const jsonShort = JSON.stringify(object)
    // console.log('testing json:', jsonShort)

    const sObjectLong = parse(jsonLong)
    const sObjectShort = parse(jsonShort)

    expect(sObjectLong).toEqual(object)
    expect(sObjectShort).toEqual(object)
  }
})

test.skip('parsing random sloppy strings', () => {
  const COUNT = 20000

  for (let i = 0; i < COUNT; i++) {
    const { object, sloppy } = randomSloppyStrings.create()

    try {
      var sloppyObject = parse(sloppy)
    } catch (err) {
      console.log(`error parsing sloppy json: ${err.message}`)
      console.log(`object: ${JSON.stringify(object)}`)
      console.log(`sloppy: ${JSON.stringify(sloppy)}`)
      throw err
    }

    const jsonSloppy = JSON.stringify(sloppyObject)
    const jsonObject = JSON.stringify(object)
    if (jsonSloppy !== jsonObject) {
      console.log(`object: ${jsonObject}`)
      console.log(`sloppy: /${sloppy}/`)
    }

    expect(jsonSloppy).toEqual(jsonObject)
  }
})
