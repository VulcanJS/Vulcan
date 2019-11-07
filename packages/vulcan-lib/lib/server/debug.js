import { GraphQLSchema, generateTypeDefs } from './graphql';
import Vulcan from '../modules/config.js';
import fs from 'fs';

if (Meteor.isServer) {
  /*

  Can be called from the Meteor shell (type `meteor shell` in your app repo)

  */
  Vulcan.getGraphQLSchema = () => {
    let schema;
    if (!GraphQLSchema.finalSchema) {
      schema = generateTypeDefs(GraphQLSchema)[0];
      // eslint-disable-next-line no-console
      console.log(
        'Warning: trying to access final GraphQL schema before it has been created by the server.'
      );
    } else {
      schema = GraphQLSchema.finalSchema[0];
    }

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

  Vulcan.logToFile = (fileName, object) => {
    // eslint-disable-next-line no-undef
    const path = __meteor_bootstrap__.serverDir.split('/').slice(1,-5).join('/');
    const fullPath = `/${path}/${fileName}`;

    fs.writeFile(fullPath, JSON.stringify(object, null, 2), error => {
      // throws an error, you could also catch it here
      if (error) throw error;

      // eslint-disable-next-line no-console
      console.log(`Object saved to ${fullPath}`);
    });
  };
  
}