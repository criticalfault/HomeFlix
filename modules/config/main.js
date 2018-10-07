// this module is just going to read in the config file and export the object so that it can be required 
// anywhere in the project and we dont have to worry about env variables

const fs = require('fs')
const path = require('path')
const configFile = "config.json"

let rawData = fs.readFileSync(path.resolve(configFile));
let parsedData = JSON.parse(rawData);

//console.log(parsedData);

module.exports = parsedData