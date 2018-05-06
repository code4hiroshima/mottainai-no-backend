/* eslint-disable no-console */
import { google } from 'googleapis';
import { getSheet, sheetToModel } from './sheet';

/**
 * Cloud Functionがレスポンスを返す際に利用するHTTPヘッダーの一覧
 * @type {*[]}
 */
const headers = [
  ['Content-Type', 'application/json'],
  ['Access-Control-Allow-Origin', '*'],
  ['Access-Control-Allow-Credentials', 'true'],
];

/**
 * Google APIの実行に必要なtokenを取得するクライアントを生成します。
 * 利用には生成したオブジェクトのauthorizeメソッドの実行が必要です。
 * @param client_email
 * @param private_key
 * @returns {JWT}
 */
const createJWT = ({ client_email, private_key }) =>
  new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets'], // an array of auth scopes
    null,
  );

/**
 * Google の SpreadSheet APIを実行するためのデフォルトパラメータを生成します
 * @param config
 * @param credentials
 * @returns {Promise<{auth: *, spreadsheetId: (string|string)}>}
 */
const createDefaultParams = async ({ config, credentials }) => {
  const auth = createJWT(credentials);
  await auth.authorize();
  return {
    auth,
    spreadsheetId: config.spreadsheetId,
  };
};

const getFromSpread = async (paramsPromise) => {
  const params = await paramsPromise;
  const sheetName = 'こども食堂';
  const sheet = await getSheet({ ...params, sheetName });
  console.log(sheetToModel(sheet));
};

module.exports = (config, credentials) => {
  const paramsPromise = createDefaultParams({ config, credentials });
  // expressのハンドラーを生成する関数
  // 読み込みするシート名を関数名を引数にわたすと、expressのハンドラーが生成されます。
  const build = sheetName => (req, res) => (async () => {
    const params = await paramsPromise;
    const sheet = await getSheet({ ...params, sheetName });
    res.status(200);
    for (const [key, value] of headers) {
      res.append(key, value);
    }
    res.send(sheetToModel(sheet));
  })();

  return {
    kodomo_shokudo: build('こども食堂'),
    food_bank: build('フードバンク'),
    loss_non: build('食品ロス削減協力店'),
    local: () => getFromSpread(paramsPromise),
  };
};
