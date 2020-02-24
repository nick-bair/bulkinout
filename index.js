
// TODO parameterize loading resource, options
//---------- input-------------------// 
const resource = 'candidates'
let options = {
    pageSize: 200,
    where: `dateLastModified>'2020-01-01'`
}
//---------------------------------//

// optionally sets env vars via doctor account
require('./util/loadAccount')()
// ensure necessary envs set
require('./util/required')(['BASE_URL', 'ELEMENT_TOKEN', 'USER_SECRET', 'ORG_SECRET'])

const api = require('./util/api')

// test with where clause
require('./bulk/via-ce-get')(api, resource, options)
require('./bulk/via-connectorjs')(api, resource, options)