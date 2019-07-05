'use strict'

// generate seed-based random JSONable objects to test with

module.exports = {
  choose,
  chooseEqually,
  randomInteger,
  setRandoSeed
}

const randomSeed = require('random-seed')

let Random

/** return an integer from 1 .. maxExclusive-1 */
/** @param {number} [maxExclusive] - return value will be below this number */
function randomInteger (maxExclusive) {
  if (Random == null) throw new Error('setRandoSeed() must be called first')
  return Random(maxExclusive)
}

/** return one of the values randomly */
function chooseEqually (...values) {
  const options = values.map(value => [1, value])
  return choose(options)
}

// Takes an array of [ number, object ] values; the numbers represent the
// weight of choosing the associated object.  One of the associated objects
// will be returned as the value.
/** return one of the values by weight */
/** @param {[number, any][]} [options] - array of [weight, value] options */
function choose (options) {
  if (Random == null) throw new Error('setRandoSeed() must be called first')

  let total = 0
  for (const [ chance ] of options) total += chance

  if (total === 0) throw new Error('total of options must be > 0')

  const picked = Random.floatBetween(0, total)

  let current = 0
  for (const [ chance, value ] of options) {
    current += chance
    if (picked < current) return value
  }

  // if we screwed up, return last item
  return options[options.length - 1][1]
}

/** set the random seed to a specific value; call before using the library */
/** @param {string} [seed] - seed for random numbers */
function setRandoSeed (seed) {
  if (seed == null) throw new Error('seed required')

  Random = randomSeed.create(`${seed}`)
}
