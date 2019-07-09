'use strict'

/* global test, expect */

const random = require('./lib/random')
const randomValues = require('./lib/random-values')
const randomSloppyStrings = require('./lib/random-sloppy-strings')

const { parse, stringify } = require('../sloppy-json')

const seed = process.env.RANDO_SEED || new Date().toISOString()
random.setRandoSeed(seed)
console.log(`rando seed: ${seed}`)

test('parsing random values', () => {
  const COUNT = 20000

  for (let i = 0; i < COUNT; i++) {
    let jsonL
    let jsonS
    let objectL
    let objectS

    const object = randomValues.create()

    jsonL = JSON.stringify(object, null, 4)
    jsonS = JSON.stringify(object)

    objectL = parse(jsonL)
    objectS = parse(jsonS)

    expect(objectL).toEqual(object)
    expect(objectS).toEqual(object)

    jsonL = stringify(object, null, 4)
    jsonS = stringify(object)

    try {
      objectL = parse(jsonL)
    } catch (err) {
      console.log(`error parsing: ${jsonL}`)
      console.log(err.message)
    }

    try {
      objectS = parse(jsonS)
    } catch (err) {
      console.log(`error parsing: ${jsonS}`)
      console.log(err.message)
    }

    objectS = parse(jsonS)

    expect(objectL).toEqual(object)
    expect(objectS).toEqual(object)
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
