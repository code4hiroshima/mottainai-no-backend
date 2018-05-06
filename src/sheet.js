import { values } from './google/spreadsheets';

export const getSheet = ({ spreadsheetId, sheetName, auth }) =>
  values.get({
    auth,
    spreadsheetId,
    range: encodeURI(sheetName),
  });

export const sheetToModel = (sheet) => {
  const keys = sheet.data.values[0];
  const nameIndex = keys.indexOf('名称');
  const urlIndex = keys.indexOf('紹介HP');
  const latitudeIndex = keys.indexOf('緯度');
  const longitudeIndex = keys.indexOf('経度');
  const values = sheet.data.values;
  // フィールド名を削除して値だけの配列にする
  values.shift();
  return values.map(row => ({
    name: row[nameIndex],
    url: row[urlIndex],
    latitude: row[latitudeIndex],
    longitude: row[longitudeIndex],
  }));
};

export const mockGetSheet = async () => ({
  data: {
    range: '\'こども食堂\'!A1:AA1000',
    majorDimension: 'ROWS',
    values:
      [['No', '名称', '住所', '緯度', '経度', '紹介HP', 'データ提供元'],
        ['1',
          '青い鳥',
          '広島市南区的場2-1-1',
          '34.392487',
          '132.475126',
          'https://www.facebook.com/tunago.p/',
          'ひろしまこども夢財団'],
        ['2',
          '食べて語ろう会',
          '広島市中区基町20',
          '34.403409',
          '132.457147',
          'https://tabetekataroukai.wordpress.com/',
          'ひろしまこども夢財団'],
      ]
  }
});
