# Bulkinout
Processes various bulk requests and reports duration 

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
```
***tip*** set DOCTOR_ACCOUNT=[instead of BASE_URL, USER_SECRET, ORG_SECRET]

2. `$ npm start`

***example output format:*** Script | Records Count | Resource | Duration
```
ce-gets,6,candidates,2.162 sec
ce-bulk,6,candidates,13.27 sec
ce-bulk,477,candidates,14.749 sec
ce-gets,477,candidates,15.698 sec
```

3. Edit [index.js](index.js) to change the resource and query.