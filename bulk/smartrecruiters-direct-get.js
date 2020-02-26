module.exports = async (api, element, resource, options) => {

    //begin timing bulk function
    const timer = require('../util/timer')
    const start = timer.begin()
    const rows = await getRows(api.get, resource, options)

    //report result with duration
    const bulkStats = { id: 'smartrecruiters-direct-get', count: `${rows ? rows.length : 0}`, element, resource, duration: timer.end(start), unit: 'seconds', filter: `${options.createdOn ? 'createdOn:' + options.createdOn : ''}`, bulk_version: `node-get-loop` }

    console.log(bulkStats)
    return bulkStats
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
                    setTimeout((data) => console.log(`${data.data}`), 3000)
            } else {
                options.offset += more.data.limit
                result = result.concat(more.data.content)
                go = more && more.data.content.length < options.limit ? false : true
                let datenow = new Date()
                console.log(datenow + ` total records received: ${result.length}`)
            }
        }
        return result
    } catch (e) {
        console.log(e.message ? e.message : e)
        return {message : e.message ? e.message : e}
    }
}
