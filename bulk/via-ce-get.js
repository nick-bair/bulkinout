module.exports = async (api, resource, options) => {
  
   //begin timing bulk function
    const begin = require('../util/timer')
    const rows = await getRows(api.get, resource, options)
    //report result with duration
    console.log(`ce-gets,${rows ? rows.length : 0},${resource},${begin.end()} sec`)
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
    }
}
