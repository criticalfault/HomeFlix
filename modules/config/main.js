const fs = require('fs')
const path = require('path')
const configFile = "config.json"

let rawData = fs.readFileSync(path.resolve(configFile));
let parsedData = JSON.parse(rawData);

module.exports = parsedData