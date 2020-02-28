'use-strict'
const otc = require('objects-to-csv')

const processBulkTests = async (options) => {
    try {
        let api
        // optionally sets env vars via doctor account
        require('./util/loadAccount')()
        // ensure necessary envs set
        require('./util/required')(['BASE_URL', 'BULKINOUT_ELEMENT_TOKEN', 'USER_SECRET', 'ORG_SECRET', 'BULKINOUT_ELEMENT_KEY', 'BULKINOUT_ELEMENT_RESOURCE'])

        // vendor direct if available
        if (element === 'smartrecruiters' && vendorToken) {
            options = {
                limit: 100,
                offset: 0,
                createdOn: '2020-02-21T20:33:58.000Z'
            }
            api = require('./util/api-smartrecruiters')
            await exec_bulk('smartrecruiters-vendor-direct-get', api, element, resource, options)
        }
        if (element === 'caagilecentral' && vendorToken) {
            options = {
                pagesize: 2000,
                start: 1
            }
            api = require('./util/api-rally')
            await exec_bulk('rally-vendor-direct-get', api, element, resource, options)
        }
        // cloud elements
        api = require('./util/api')
        await exec_bulk('ce-get', api, element, resource, options)
        await exec_bulk('connector-js', api, element, resource, options)

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
const element = process.env.BULKINOUT_ELEMENT_KEY
const resource = process.env.BULKINOUT_ELEMENT_RESOURCE
const vendorToken = process.env.BULKINOUT_VENDOR_TOKEN
let options = process.env.BULKINOUT_ELEMENT_REQUEST_OPTIONS ? process.env.BULKINOUT_ELEMENT_REQUEST_OPTIONS : { pageSize: 2000 } // need to at lease have a default page set for api code
processBulkTests(options)