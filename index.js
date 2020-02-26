
// TODO parameterize loading resource, options
//---------- input-------------------// 
const element = 'smartrecruiters'
const resource = 'candidates'
let api

if (!process.env.VENDOR_DIRECT) {

    let options = {
        pageSize: 200,
        where: `createdOn='2020-02-21T20:33:58.000Z'`
    }
    // optionally sets env vars via doctor account
    require('./util/loadAccount')()
    // ensure necessary envs set
    require('./util/required')(['BASE_URL', 'ELEMENT_TOKEN', 'USER_SECRET', 'ORG_SECRET'])
    api = require('./util/api')

    require('./bulk/via-ce-get')(api, element, resource, options)
    require('./bulk/via-connectorjs')(api, element, resource, options)

} else if (element === 'smartrecruiters' && process.env.VENDOR_DIRECT) {

    options = {
        limit: 100, // smart recruiters has max of 100
        offset: 0,
        createdOn: '2020-02-21T20:33:58.000Z'
    }

    api = require('./util/api-smartrecruiters')
    require('./bulk/via-smartrecruiters-get')(api, element, resource, options)
}

