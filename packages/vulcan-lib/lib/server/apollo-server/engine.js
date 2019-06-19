import { getSetting } from '../../modules/settings.js';
// @see https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#EngineReportingOptions

let engineConfigObject = getSetting('apolloEngine');

if (!engineConfigObject || !engineConfigObject.apiKey) {
  engineConfigObject = {
    apiKey: process.env.ENGINE_API_KEY,
    schemaTag: process.env.ENGINE_SCHEMA_TAG
  };
}

export const engineConfig = engineConfigObject && engineConfigObject.apiKey ? engineConfigObject : undefined;
