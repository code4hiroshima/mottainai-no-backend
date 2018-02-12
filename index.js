'use strict';
const config = require('./.config.js');
const credential = require('./credentials.json');

module.exports = require('./dist/index')(config, credential);