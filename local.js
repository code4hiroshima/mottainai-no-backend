import config from './config';
import credentials from './credentials';

require('./src/index')(config, credentials).local();
