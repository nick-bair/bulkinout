'use strict'
const start = new Date()
const end = () => {
    return (new Date() - start) / 1000
}

module.exports = { end }