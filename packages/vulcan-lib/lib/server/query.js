/*

Run a GraphQL request from the server with the proper context

*/
import { graphql } from 'graphql';
import { Collections } from '../modules/collections.js';
import DataLoader from 'dataloader';
import findByIds from '../modules/findbyids.js';
import { extractFragmentName, getFragmentText } from '../modules/fragments.js';
import { getDefaultFragmentText } from '../modules/graphql/defaultFragment.js';

import { getSetting } from '../modules/settings';
import merge from 'lodash/merge';
import { singleClientTemplate } from '../modules/graphql_templates/index.js';
import { Utils } from './utils';
import { GraphQLSchema } from './graphql/index.js';
import { useQueryCache } from './caching.js';
import { expandQueryFragments } from '../modules/fragments.js';

// note: if no context is passed, default to running requests with full admin privileges
export const runGraphQL = async (query, variables = {}, context = {}, options = {}) => {
  const defaultContext = {
    currentUser: { isAdmin: true },
    locale: getSetting('locale'),
  };
  const { useCache = false, key } = options;
  const queryContext = merge(defaultContext, context);
  const executableSchema = GraphQLSchema.getExecutableSchema();

  // within the scope of this specific request,
  // decorate each collection with a new Dataloader object and add it to context
  Collections.forEach(collection => {
    collection.loader = new DataLoader(ids => findByIds(collection, ids, queryContext), {
      cache: true,
    });
    queryContext[collection.options.collectionName] = collection;
  });

  const fullQueryContext = merge({}, queryContext, GraphQLSchema.context);

  const queryWithFragments = expandQueryFragments(query);

  // see http://graphql.org/graphql-js/graphql/#graphql
  const result = useCache
    ? await useQueryCache({ query: queryWithFragments, variables, context: fullQueryContext, key })
    : await graphql(executableSchema, queryWithFragments, {}, fullQueryContext, variables);

  if (result.errors) {
    // eslint-disable-next-line no-console
    console.error(`runGraphQL error: ${result.errors[0].message}`);
    // eslint-disable-next-line no-console
    console.error(result.errors);
    throw new Error(result.errors[0].message);
  }

  return result;
};

export const runQuery = runGraphQL; //backwards compatibility

/*

Given a collection and a fragment, build a query to fetch one document. 
If no fragment is passed, default to default fragment

*/
export const buildQuery = (collection, { fragmentName, fragmentText }) => {
  const collectionName = collection.options.collectionName;
  const typeName = collection.options.typeName;

  const defaultFragmentName = `${collectionName}DefaultFragment`;
  const defaultFragmentText = getDefaultFragmentText(collection, {
    onlyViewable: false,
  });

  // default to default name and text
  let name = defaultFragmentName;
  let text = defaultFragmentText;

  if (fragmentName) {
    // if fragmentName is passed, use that to get name
    name = fragmentName;
    // any registered fragment's text will be automatically added by runGraphQL()
    text = '';
  } else if (fragmentText) {
    // if fragmentText is passed, use that to get name and text
    name = extractFragmentName(fragmentText);
    text = fragmentText;
  }

  const query = `${singleClientTemplate({
    typeName,
    fragmentName: name,
  })}${text}`;

  return query;
};

Meteor.startup(() => {
  Collections.forEach(collection => {
    const typeName = collection.options.typeName;

    collection.queryOne = async (inputOrId, { fragmentName, fragmentText, context }) => {
      let input = inputOrId;

      if (typeof inputOrId === 'string') {
        input = { id: inputOrId };
      }

      const query = buildQuery(collection, { fragmentName, fragmentText });
      const result = await runGraphQL(query, { input }, context);
      return result.data[Utils.camelCaseify(typeName)].result;
    };
  });
});
