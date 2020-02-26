# Bulkinout
Processes bulk, 1st by manually paging a Cloud Elements resource, 2nd submits the same as a bulk query to Cloud Elements and mimcks connector.js fetchTable function 

See `bulk` directory for the various tests
 - [via-ce-get](./bulk/via-ce-get.js) Performs GET on the resource and aggregates each result to an array
 - [via-connectorjs](./bulk/via-connectorjs.js) Derived from connector.js to mimick thanos `fetchTable` function written in pure node.js rather than client side js. The main difference is the use of request-promise and async/await here vs. the Jquery library in thanos (which follows [MSTR example doc](https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/DataConnectorSDK/Content/topics/Connecting_to_JSON_Excel_Files.htm) ). 

# Usage
 1. Set environment variables:

```bash
BASE_URL='https://staging.cloud-elements.com'
USER_SECRET=[cloud elements secret]
ORG_SECRET=[cloud elements secret]
ELEMENT_TOKEN=[cloud elements element token]
ELEMENT_KEY: [cloud elements element key]
ELEMENT_RESOURCE:[cloud elements element resource name]
```
***tip*** set DOCTOR_ACCOUNT=[instead of BASE_URL, USER_SECRET, ORG_SECRET]

### Vendor Direct
Requires custom implementation
```
# smartrecruiters
"VENDOR_TOKEN": ["X-SmartToken"], // can obtain via element builder prehook 
"VENDOR_BASE_URL": "https://api.smartrecruiters.com"
```

2. `$ npm start`

***example output format:*** Script | Records Count | Resource | Duration
```
ce-get,747,smartrecruiters,jobs,24.958,seconds,createdOn='2020-02-21T20:33:58.000Z',node-get-loop
connector-js,747,smartrecruiters,jobs,8.94,seconds,createdOn='2020-02-21T20:33:58.000Z',bulk-v1
```

3. Edit [index.js](index.js) to change the resource and query.