'option strict'
/**
 * This bulk process (submit/wait/"fixJson"/return) is derived from connector.js to represent 
 * thanos fetchTable function performance when written in pure node rather than of client side, injested javascript 
 */

const R = require('ramda')
module.exports = async (api, resource, options) => {
    try {
        const query = options.where ? `select * from ${resource} where ${options.where}` : `select * from ${resource}`
                
        //begin timing bulk function
        const timer = require('../util/timer')
        const start = timer.begin()

        const getBulk = R.pipeP(
            bulkQuery(api.post),
            bulkStatus(api.get),
            bulkData(api.get, resource),
            fixJsonData
        )
        const rows = await getBulk(query)
        //report result with duration
        console.log(`ce-bulk,${rows ? rows.length : 0},${resource},${timer.end(start)},seconds,${options.where ? options.where :''}`)

    } catch (e) {
        console.log(e.message ? e.message : e)
    }
}

const bulkData = R.curry(async (req, tbl, id) => {
    let bulk = await req(`/bulk/${id}/${tbl}`, '')
    return bulk.data
})

const bulkQuery = R.curry(async (req, q) => {
    let bulk = await req(`/bulk/query?q=${q}`, '')
    console.log(`  bulk id:${bulk.id} submitted `)
    return bulk.id
})

const bulkStatus = R.curry(async (req, id) => {
    while (true) {
        waiting(3000)
        let check = await req(`/bulk/${id}/status`, '')
        if (R.contains(check.data.status, ['COMPLETED', 'SUCCESS'])) {
            return check.data.id
        } else if (!R.contains(check.data.status, ['RUNNING', 'CREATED', 'SCHEDULED', 'CANCELLATION_PENDING'])) {
            throw new Error(`Status: ${check.body.status}, Table: ${check.body.object_name}, Bulk id: ${id}, Error: ${check.body.error}, infoMessage: ${check.body.infoMessage}`)
        }
        //console.log(`ce-bulk status: recordsCount ${check.data.recordsCount}`)
    }
})

const waiting = (ms) => {
    let start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}
const fixJsonData = data => {
    // ce returns jsonL from bulk
    try {
        if (data === undefined || data === "") {
            return '[]'
        }
        if (typeof (data) === "object" && !(data instanceof Array)) {
            return R.append(data, [])
        } else if (typeof (data) === "string" && R.pipe(R.head, R.equals('{'))(data)) {
            return R.append(JSON.parse(data), [])
        } else {
            return data
        }
    } catch (err) {
        data = data.split('\n').join(',\n')
        data = data.substring(0, data.length - 2)
        data = '[' + data + ']'
        return JSON.parse(data)
    }
}