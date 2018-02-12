'use strict';

// dependencies
const async = require('async');
const GoogleSpreadsheet = require('google-spreadsheet');
const sheetSet = {
  kodomoSyokudo: 'こども食堂',
  foodBank: 'フードバンク',
  lossNon: '食品ロス削減協力店'
};

const config = require('./.config.js');
const spreadSheetKey = config.spreadSheetKey;
const credentialFile = './credentials.json';

const getResponse = (code, body) => {
  return {
    statusCode: code,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: body
  };
};

const scanSheets = (info, title, fn) => {
  if (!info.worksheets) {
    fn();
    return;
  }

  info.worksheets.map((sheet, index) => {
    console.log(index);
    console.log(sheet.title);
    if (title === sheet.title) {
      fn(sheet);
    }
  });
};

const getData = (sheet, offset, limit, result, fn) => {
  sheet.getRows(
    {
      offset: offset,
      limit: limit,
      orderby: 'col1'
    },
    function(err, rows) {
      // console.log(rows[0]);
      rows.map(row => {
        if (row['経度'] && row['緯度']) {
          result.push({
            name: row['名称'],
            latitude: row['緯度'],
            longitude: row['経度'],
            url: row['紹介hp']
          });
        }
      });
      if (rows.length < limit) {
        fn(result);
      } else {
        offset += limit;
        getData(sheet, offset, limit, result, fn);
      }
    }
  );
};

const getFromSpread = (params, callback) => {
  let doc = new GoogleSpreadsheet(spreadSheetKey);
  let sheet;
  return async.series(
    [
      function setAuth(step) {
        var creds = require('./' + credentialFile);
        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
          scanSheets(info, sheetSet[params.dataType], result => {
            sheet = result;
            step();
          });
        });
      },
      function workingWithRows(step) {
        // google provides some query options
        let offset = 1;
        let limit = 100;
        let result = [];
        getData(sheet, offset, limit, result, result => {
          callback(null, getResponse(200, JSON.stringify(result)));
        });
      }
    ],
    function(err) {
      if (err) {
        console.log('Error: ' + err);
      }
    }
  );
};

module.exports.getFromSpread = getFromSpread;
module.exports.handler = (event, context, callback) => {
  console.log(event);
  let q = event.body.split('&');
  let params = {};
  q.map(s => {
    let qs = s.split('=');
    if (qs.length == 2) {
      params[qs[0]] = qs[1];
    }
  });
  console.log(params);
  if (params.dataType) {
    getFromSpread(params, callback);
  } else {
    callback(null, getResponse(400, 'dataType is missing.'));
  }
};
module.exports.function = (req, res) => {
  if (req.body.dataType) {
    getFromSpread(req.body, (_, value) => {
      res.status(value.statusCode);
      Object.keys(value.headers).map(key => {
        res.append(key, value.headers[key]);
        return;
      });
      res.send(value.body);
    });
  } else {
    res.status(400).send('dataType is missig');
  }
};
