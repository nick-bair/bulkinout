# Bulkinout
Reports bulk processing duration for various methods of bulk using identical arguments:
1. By paging a Cloud Elements resource
1. By mimicking connector.js fetchTable function which submits a bulk query to Cloud Elements, checks status, then requests the json result
1. By paging vendor direct: 
   1. smartrecruiters

See `bulk` directory for the various tests
 - [via-ce-get](./bulk/via-ce-get.js) Performs GET on the resource and aggregates each result to an array
 - [via-connectorjs](./bulk/via-connectorjs.js) Derived from connector.js, written for [MSTR `fetchTable` function](https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/DataConnectorSDK/Content/topics/Connecting_to_JSON_Excel_Files.htm) and updated to use node/request-promise rather than browser/JQuery 

# Usage
 1. Set environment variables:

 ### Cloud Elements Info

```bash
BASE_URL=https://staging.cloud-elements.com
USER_SECRET=[cloud elements secret]
ORG_SECRET=[cloud elements secret]
```
***tip*** set DOCTOR_ACCOUNT=[instead of BASE_URL, USER_SECRET, ORG_SECRET]

### Element Info

```
BULKINOUT_ELEMENT_TOKEN=[cloud elements element token]
BULKINOUT_ELEMENT_KEY: [cloud elements element key]
BULKINOUT_ELEMENT_RESOURCE:[cloud elements element resource name]
```

### Vendor Direct
Requires additional parameters and custom [bulk](./bulk) implementation.
```
# smartrecruiters
"BULKINOUT_VENDOR_TOKEN": ["X-SmartToken"], // can obtain via element builder prehook 
"BULKINOUT_VENDOR_BASE_URL": "https://api.smartrecruiters.com"
```

2. `$ npm start`

Each test will output record count status to the console and append final results to results.csv located in the root directory. 

***example output:***
```
ce-get,747,smartrecruiters,jobs,7.735,seconds,LastUpdateDate='2020-02-21T20:33:58.000Z',node-get-loop
connector-js,747,smartrecruiters,jobs,11.914,seconds,LastUpdateDate='2020-02-21T20:33:58.000Z',bulk-v1
smartrecruiters-direct-get,747,smartrecruiters,jobs,7.981,seconds,createdOn:2020-02-21T20:33:58.000Z,node-get-loop
```