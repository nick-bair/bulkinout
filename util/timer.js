'use strict'


const begin = () => new Date()

const end = (start) => {
    return (new Date() - start) / 1000
}

module.exports = { begin, end }