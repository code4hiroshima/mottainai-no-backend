const getFromSpread = require('./src/index.js').getFromSpread;
getFromSpread({dataType: 'kodomoSyokudo'}, (_, value) => console.log(value) );
