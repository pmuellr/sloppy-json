#!/usr/bin/env node

const date = new Date()
const hh = `${date.getHours()}`.padStart(2, '0')
const mm = `${date.getMinutes()}`.padStart(2, '0')
const ss = `${date.getSeconds()}`.padStart(2, '0')

const time = `${hh}:${mm}:${ss}`

let message = process.argv.slice(2).join(' ')

if (message === '') {
  message = time
} else if (message.indexOf('%') === -1) {
  message = `${time} - ${message}`
} else {
  message = message.replace('%', time)
}

console.log(message)
