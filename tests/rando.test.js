'use strict'

/* global test, expect */

const random = require('./lib/random')
const randomValues = require('./lib/random-values')

const { parse } = require('../sloppy-json')

const seed = process.env.RANDO_SEED || new Date().toISOString()
random.setRandoSeed(seed)
console.log(`rando seed: ${seed}`)

test('rando tests', () => {
  for (let i = 0; i < 20000; i++) {
    const object = randomValues.create()
    const jsonLong = JSON.stringify(object, null, 4)
    const jsonShort = JSON.stringify(object, null, 4)

    const sObjectLong = parse(jsonLong)
    const sObjectShort = parse(jsonShort)

    expect(sObjectLong).toEqual(object)
    expect(sObjectShort).toEqual(object)
  }
})
