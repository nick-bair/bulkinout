module.exports = async (api, element, resource, options) => {

    //begin timing bulk function
    const timer = require('../util/timer')
    const start = timer.begin()
    console.log(`ce-get status: started get loop @ ${start}`)
    const rows = await getRows(api.get, resource, options)

    //report result with duration
    const bulkStats = { id: 'ce-get', count: `${rows ? rows.length : 0}`, element, resource, duration: timer.end(start), unit: 'seconds', filter: `${options.where ? options.where : ''}`, bulk_version: `node-get-loop` }

    console.log(bulkStats)
    return bulkStats
}

const getRows = async (get, resource, options) => {
    try {
        let go = true
        let result = []
        while (go) {
            let more = await get(`/${resource}`, options)
            options.nextPage = more.headers["elements-next-page-token"]
            result = result.concat(more.data)
            go = more && more.data.length < options.pageSize ? false : true
        }
        return result
    } catch (e) {
        console.log(e.message ? e.message : e)
        return { message: e.message ? e.message : e }
    }
}
