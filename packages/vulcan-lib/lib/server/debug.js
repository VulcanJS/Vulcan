import { GraphQLSchema } from './graphql/graphql.js';
import { generateTypeDefs } from './graphql/typedefs.js';
import Vulcan from '../modules/config.js';
import fs from 'fs';

import { Collections } from '../modules/collections.js';
import { extractCollectionInfo, extractFragmentInfo } from '../modules/handleOptions';

import { multiClientTemplate, singleClientTemplate } from '../modules/graphql_templates';
import { Fragments } from '../modules/fragments';
import { Utils } from '../modules/utils';

import get from 'lodash/get';

/*

  Can be called from the Meteor shell (type `meteor shell` in your app repo)

  */
export const getGraphQLSchema = fileName => {
  let schema;
  if (!GraphQLSchema.finalSchema) {
    schema = generateTypeDefs(GraphQLSchema)[0];
    // eslint-disable-next-line no-console
    console.log('Warning: trying to access final GraphQL schema before it has been created by the server.');
  } else {
    schema = GraphQLSchema.getSchema();
  }

  const name = fileName ? fileName : 'schema.graphql';
  logToFile(name, schema, { mode: 'overwrite' });

  return schema;
};

Vulcan.getGraphQLSchema = getGraphQLSchema;

export const logToFile = (fileName, object, options = {}) => {
  const { mode = 'append', timestamp = false } = options;
  // the server path is of type "/Users/foo/bar/appName/.meteor/local/build/programs/server"
  // we remove the last five segments to get the app directory
  // eslint-disable-next-line no-undef
  const path = __meteor_bootstrap__.serverDir
    .split('/')
    .slice(1, -5)
    .join('/');
  const fullPath = `/${path}/${fileName}`;
  const contents = typeof object === 'string' ? object : JSON.stringify(object, null, 2);
  const now = new Date();
  const text = timestamp ? now.toString() + '\n---\n' + contents : contents;
  if (mode === 'append') {
    const stream = fs.createWriteStream(fullPath, { flags: 'a' });
    stream.write(text + '\n\n');
    stream.end();
  } else {
    fs.writeFile(fullPath, text, error => {
      // throws an error, you could also catch it here
      if (error) throw error;

      // eslint-disable-next-line no-console
      console.log(`Object saved to ${fullPath}`);
    });
  }
};

Vulcan.logToFile = logToFile;

/*
  This function is aimed at enabling generation of typescript definitions
  for the default queries provided by Vulcan.

  Tools like apollo codegen:generate generate typescript definitions when
  provided with a schema and queries/fragments.
  */
export const generateGraphQLQueries = fileName => {
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

Vulcan.generateGraphQLQueries = generateGraphQLQueries;
