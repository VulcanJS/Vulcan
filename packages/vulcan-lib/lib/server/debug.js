import { GraphQLSchema, generateTypeDefs } from './graphql';
import Vulcan from '../modules/config.js';
import fs from 'fs';

import { Collections } from '../modules/collections.js';
import { extractCollectionInfo, extractFragmentInfo } from '../modules/handleOptions';

import { multiClientTemplate, singleClientTemplate } from '../modules/graphql_templates';
import { Fragments } from '../modules/fragments';
import { Utils } from '../modules/utils';

import get from 'lodash/get';

if (Meteor.isServer) {
  /*

  Can be called from the Meteor shell (type `meteor shell` in your app repo)

  */
  Vulcan.getGraphQLSchema = fileName => {
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

    const name = fileName ? fileName : 'schema.graphql';
    // the server path is of type "/Users/foo/bar/appName/.meteor/local/build/programs/server"
    // we remove the last five segments to get the app directory
    // eslint-disable-next-line no-undef
    const path = __meteor_bootstrap__.serverDir.split('/').slice(1,-5).join('/');
    const fullPath = `/${path}/${name}`;

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

  Vulcan.generateGraphQLQueries = fileName => {
    let fd;

    const name = fileName ? fileName : 'queries.graphql';

    try {
      // eslint-disable-next-line no-undef
      const path = __meteor_bootstrap__.serverDir
        .split('/')
        .slice(1, -5)
        .join('/');
      const fullPath = `/${path}/${name}`;
      fd = fs.openSync(fullPath, 'w');

      Object.keys(Fragments).forEach(fragment => fs.appendFileSync(fd, Fragments[fragment].fragmentText + '\n'));

      fs.appendFileSync(fd, '\n');

      Collections.forEach(collection => {
        const { collectionName } = extractCollectionInfo({ collection });
        const { fragmentName } = extractFragmentInfo({}, collectionName);

        const typeName = collection.options.typeName;


        if (get(GraphQLSchema.resolvers, `Query.${Utils.camelCaseify(typeName)}`)) {
          const singleQueryString = singleClientTemplate({
            typeName,
            fragmentName,
          });
          fs.appendFileSync(fd, singleQueryString + '\n');
        }

        if (get(GraphQLSchema.resolvers, `Query.${Utils.camelCaseify(Utils.pluralize(typeName))}`)) {

          const multiQueryString = multiClientTemplate({
            typeName,
            fragmentName,
          });
          fs.appendFileSync(fd, multiQueryString + '\n');
        }

      });
    } catch (err) {
      console.log(err);
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }
  };
}
