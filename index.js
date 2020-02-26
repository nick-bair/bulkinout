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

        await exec_bulk('via-ce-get', api, element, resource, options)
        await exec_bulk('via-connector-js', api, element, resource, options)

        // vendor direct if available
        if (element === 'smartrecruiters' && process.env.VENDOR_TOKEN) {
            options = {
                limit: 100,
                offset: 0,
                createdOn: '2020-02-21T20:33:58.000Z'
            }
            api = require('./util/api-smartrecruiters')
            await require('./bulk/via-smartrecruiters-get')(api, element, resource, options)
        }
    } catch (e) {
        console.log({ message: e.message ? e.message : e })
    }
}

const exec_bulk = async (test, api, element, resource, options) => {
    const results = await require(`./bulk/${test}`)(api, element, resource, options)
    const csv = new otc([results])
    await csv.toDisk(`./results.csv`, { append: true })
}

const element = process.env.ELEMENT_TOKEN
const resource = process.env.ELEMENT_RESOURCE
let options = process.env.REQUEST_OPTIONS ? process.env.REQUEST_OPTIONS : {
    pageSize: 200,
    where: `createdOn='2020-02-21T20:33:58.000Z'`
}

processBulkTests(options)