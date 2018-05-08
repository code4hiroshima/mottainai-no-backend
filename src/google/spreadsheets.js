import { google } from 'googleapis';
import Promise from 'bluebird';

const sheets = google.sheets({
  version: 'v4',
});

export const get = Promise.promisify(sheets.spreadsheets.get);
export const getByDataFilter = Promise.promisify(sheets.spreadsheets.getByDataFilter);
export const values = {
  get: Promise.promisify(sheets.spreadsheets.values.get)
};

export default {
  get,
  getByDataFilter,
  values,
};
