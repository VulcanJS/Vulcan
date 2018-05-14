/*

Run a GraphQL query from the server with the proper context

*/
import { graphql } from 'graphql';
import { executableSchema } from './apollo_server.js';
import { Collections } from '../modules/collections.js';
import DataLoader from 'dataloader';
import findByIds from '../modules/findbyids.js';
import { getDefaultFragmentText, extractFragmentName, getFragmentText } from '../modules/fragments.js';
import { getSetting } from '../modules/settings';
import merge from 'lodash/merge';

// note: if no context is passed, default to running queries with full admin privileges
export const runQuery = async (query, variables = {}, context ) => {

  const defaultContext = { currentUser: {isAdmin: true}, locale: getSetting('locale') };
  const queryContext = merge(defaultContext, context);

  // within the scope of this specific query, 
  // decorate each collection with a new Dataloader object and add it to context
  Collections.forEach(collection => {
    collection.loader = new DataLoader(ids => findByIds(collection, ids, queryContext), { cache: true });
    queryContext[collection.options.collectionName] = collection;
  });

  // see http://graphql.org/graphql-js/graphql/#graphql
  const result = await graphql(executableSchema, query, {}, queryContext, variables);

  if (result.errors) {
    // eslint-disable-next-line no-console
    console.error(`runQuery error: ${result.errors[0].message}`);
    // eslint-disable-next-line no-console
    console.error(result.errors);
    throw new Error(result.errors[0].message);
  }

  return result;
}

/*

Given a collection and a fragment, build a query to fetch one document. 
If no fragment is passed, default to default fragment

*/
export const buildQuery = (collection, {fragmentName, fragmentText}) => {

  const collectionName = collection.options.collectionName;
  const resolverName = `${collectionName}Single`;
  
  const defaultFragmentName = `${collectionName}DefaultFragment`;
  const defaultFragmentText = getDefaultFragmentText(collection, { onlyViewable: false });

  // default to default name and text
  let name = defaultFragmentName;
  let text = defaultFragmentText;

  if (fragmentName) { // if fragmentName is passed, use that to get name and text
    name = fragmentName;
    text = getFragmentText(fragmentName);
  } else if (fragmentText) { // if fragmentText is passed, use that to get name and text
    name = extractFragmentName(fragmentText);
    text = fragmentText;
  }

  const query = `
    query ${resolverName}Query ($documentId: String){
      ${resolverName}(documentId: $documentId){
        ...${name}
      }
    }
    ${text}
  `

  return query;
}

Meteor.startup(() => {

  Collections.forEach(collection => {

    const collectionName = collection.options.collectionName;
    const resolverName = `${collectionName}Single`;

    collection.queryOne = async (documentId, { fragmentName, fragmentText, context }) => {
      const query = buildQuery(collection, { fragmentName, fragmentText });
      const result = await runQuery(query, { documentId }, context);
      return result.data[resolverName];
    }

  });

});