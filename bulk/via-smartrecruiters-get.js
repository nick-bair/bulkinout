module.exports = async (api, element, resource, options) => {

    //begin timing bulk function
    const timer = require('../util/timer')
    const start = timer.begin()
    const rows = await getRows(api.get, resource, options)

    //report result with duration
    console.log(`vendor-direct-get,${rows ? rows.length : 0},${element},${resource},${timer.end(start)},seconds,${options.createdOn ? 'createdOn:' + options.createdOn : ''},get-loop`)
}

const getRows = async (get, resource, options) => {
    try {
        let go = true
        let result = []
        while (go) {
            let more = await get(`/${resource}`, options)
            if (more.statusCode == 429) {
                //wait for specified future epoch due to concurrency rate limt
                while (Date.now() < more.headers["x-ratelimit-reset"])
                  setTimeout(() => console.log('setTimeoutRunning'), 3000)
            } else {
                options.offset += more.data.limit
                result = result.concat(more.data.content)
                go = more && more.data.content.length < options.limit ? false : true
                let datenow = new Date()
                console.log( datenow + ` total records received: ${result.length}`)
            }
        }
        return result
    } catch (e) {
        console.log(e.message ? e.message : e)
    }
}
