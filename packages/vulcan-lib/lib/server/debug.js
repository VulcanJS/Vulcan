import { GraphQLSchema } from '../modules/graphql/graphql.js';
import Vulcan from '../modules/config.js';
import fs from 'fs';

/*

Can be called from the Meteor shell (type `meteor shell` in your app repo)

*/
Vulcan.getGraphQLSchema = () => {
  if (!GraphQLSchema.finalSchema) {
    throw new Error(
      'Warning: trying to access graphQL schema before it has been created by the server.'
    );
  }
  const schema = GraphQLSchema.finalSchema[0];

  // the server path is of type "/Users/foo/bar/appName/.meteor/local/build/programs/server"
  // we remove the last five segments to get the app directory
  // eslint-disable-next-line no-undef
  const path = __meteor_bootstrap__.serverDir.split('/').slice(1,-5).join('/');
  const fullPath = `/${path}/schema.graphql`;

  fs.writeFile(fullPath, schema, error => {
    // throws an error, you could also catch it here
    if (error) throw error;

    // eslint-disable-next-line no-console
    console.log(`GraphQL schema saved to ${fullPath}`);
  });
  return schema;
};
