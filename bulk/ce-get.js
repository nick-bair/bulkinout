'option strict'

const timer = require('../util/timer')

module.exports = async (test, api, element, resource, options) => {
    
    //begin timing bulk function
    const start = timer.begin()    
    console.log(`${test} status: started get loop @ ${start}`)

    const rows = await getRows(test, api.get, resource, options)
    
    //report result with duration (errors are recorded in count)
    const bulkStats = { id: test, count: `${rows && rows.length ? rows.length : rows.message}`, element, resource, duration: timer.end(start), unit: 'seconds', filter: `${options.where ? options.where : ''}`, bulk_version: `node-get-loop` }
    console.log(bulkStats)
    return bulkStats
}

const getRows = async (test, get, resource, options) => {
    try {
        let go = true
        let result = []
        while (go) {
            let more = await get(`/${resource}`, options)
            if (more.statusCode == 429) {
                console.log(`statusCode 429: ${more.data}`)
                timer.wait(2000)
            } else {
                options.nextPage = more.headers["elements-next-page-token"]
                result = result.concat(more.data)
                go = more && more.data.length < options.pageSize ? false : true

                console.log(`${test} status: total: ${result.length}`)
            }
        }
        return result
    } catch (e) {
        console.log(e.message ? e.message : e)
        return { message: e.message ? e.message : e }
    }
}