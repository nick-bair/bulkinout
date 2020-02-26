'use-strict'
const otc = require('objects-to-csv')
// TODO parameterize loading resource, options

const processBulkTests = async (options) => {
    try {
        let api
        // optionally sets env vars via doctor account
        require('./util/loadAccount')()
        // ensure necessary envs set
        require('./util/required')(['BASE_URL', 'ELEMENT_TOKEN', 'USER_SECRET', 'ORG_SECRET', 'ELEMENT_KEY', 'ELEMENT_RESOURCE'])
        api = require('./util/api')

        await exec_bulk('ce-get', api, element, resource, options)
        await exec_bulk('connector-js', api, element, resource, options)

        // vendor direct if available
        if (element === 'smartrecruiters' && process.env.VENDOR_TOKEN) {
            //smartrecruiters, per kibana, If I send this to CE, we transform from: createdOn='2020-02-21T20:33:58.000Z'
            //ce sends this:
            //updatedAfter = '1950-01-01T00:00:00.000Z' AND createdOn = '2020-02-21T20:33:58.000Z'
            options = {
                limit: 100,
                offset: 0,
                createdOn: '2020-02-21T20:33:58.000Z'
            }
            api = require('./util/api-smartrecruiters')
            await exec_bulk('smartrecruiters-direct-get', api, element, resource, options)
        }
    } catch (e) {
        console.log({ message: e.message ? e.message : e })
    }
}

const exec_bulk = async (test, api, element, resource, options) => {
    const results = await require(`./bulk/${test}`)(test, api, element, resource, options)
    const csv = new otc([results])
    await csv.toDisk(`./results.csv`, { append: true })
}

//--------------- run program ------------------------//
const element = process.env.ELEMENT_KEY
const resource = process.env.ELEMENT_RESOURCE
let options = process.env.REQUEST_OPTIONS ? process.env.REQUEST_OPTIONS : {
    pageSize: 200,
    where: `LastUpdateDate='2020-02-21T20:33:58.000Z'`
}

processBulkTests(options)