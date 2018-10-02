import { Engine } from 'apollo-engine';
import { getSetting } from '../../modules/settings.js';
// see https://github.com/apollographql/apollo-cache-control
const engineApiKey = getSetting('apolloEngine.apiKey');
const engineLogLevel = getSetting('apolloEngine.logLevel', 'INFO');
const engineConfig = {
  apiKey: engineApiKey,
  // "origins": [
  //   {
  //     "http": {
  //       "url": "http://localhost:3000/graphql"
  //     }
  //   }
  // ],
  stores: [
    {
      name: 'vulcanCache',
      inMemory: {
        cacheSize: 20000000
      }
    }
  ],
  // "sessionAuth": {
  //   "store": "embeddedCache",
  //   "header": "Authorization"
  // },
  // "frontends": [
  //   {
  //     "host": "127.0.0.1",
  //     "port": 3000,
  //     "endpoint": "/graphql",
  //     "extensions": {
  //       "strip": []
  //     }
  //   }
  // ],
  queryCache: {
    publicFullQueryStore: 'vulcanCache',
    privateFullQueryStore: 'vulcanCache'
  },
  // "reporting": {
  //   "endpointUrl": "https://engine-report.apollographql.com",
  //   "debugReports": true
  // },
  logging: {
    level: engineLogLevel
  }
};
let engine;
if (engineApiKey) {
  engine = new Engine({ engineConfig });
  engine.start();
}

export default {
  engine,
  engineApiKey
};
