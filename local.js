const getFromSpread = require('./index.js').getFromSpread;
getFromSpread({dataType: 'kodomoSyokudo'}, (_, value) => console.log(value) );
