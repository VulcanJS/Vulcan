import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
  getSetting, singleClientTemplate, Utils, extractCollectionInfo,
  extractFragmentInfo, deprecate
} from 'meteor/vulcan:lib';

export const singleQuery = ({
  typeName,
  fragmentName,
  fragment,
  extraQueries,
}) => {
  const query = gql`
    ${singleClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
  `;
  // debug
  //const { print } = require('graphql/language/printer');
  //console.log('****');
  //console.log(print(query));
  //console.log('****');

  return query;
};

/**
 * Create GraphQL useQuery options and variables based on props and provided options
 * @param {*} options 
 * @param {*} props
 */
const buildQueryOptions = (options, { documentId, slug, selector = { documentId, slug } }) => {
  let { pollInterval = getSetting('pollInterval', 20000), enableCache = false, fetchPolicy, queryOptions = {} } = options;
  // if this is the SSR process, set pollInterval to null
  // see https://github.com/apollographql/apollo-client/issues/1704#issuecomment-322995855
  pollInterval = typeof window === 'undefined' ? null : pollInterval;

  // OpenCrud backwards compatibility
  const graphQLOptions = {
    variables: {
      input: {
        selector,
        enableCache
      }
    },
    pollInterval // note: pollInterval can be set to 0 to disable polling (20s by default)
  };

  if (fetchPolicy) {
    deprecate('1.13.3', 'use the "queryOptions" object to pass options to the underlying Apollo hooks (hook: useSingle, option: fetchPolicy)');
    graphQLOptions.fetchPolicy = fetchPolicy;
  }
  if (typeof options.pollInterval !== 'undefined') {
    deprecate('1.13.3', 'use the "queryOptions" object to pass options to the underlying Apollo hooks (hook: useMulti, option: pollInterval)');
  }

  // see https://www.apollographql.com/docs/react/features/error-handling/#error-policies
  graphQLOptions.errorPolicy = 'all';

  return {
    ...graphQLOptions,
    ...queryOptions
  };
};

const buildResult = (
  options,
  { fragmentName, fragment, resolverName },
  returnedProps,
) => {
  const { /* ownProps, */ data, error } = returnedProps;
  const propertyName = options.propertyName || 'document';
  const props = {
    ...returnedProps,
    // document: Utils.convertDates(collection, data[singleResolverName]),
    [propertyName]: data && data[resolverName] && data[resolverName].result,
    fragmentName,
    fragment,
    data
  };
  if (error) {
    // get graphQL error (see https://github.com/thebigredgeek/apollo-errors/issues/12)
    props.error = error.graphQLErrors[0];
  }
  return props;
};

export const useSingle = (options, props) => {
  const { extraQueries } = options;
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const resolverName = Utils.camelCaseify(typeName);

  const query = singleQuery({
    typeName, fragmentName, fragment, extraQueries
  });

  const queryRes = useQuery(
    query,
    buildQueryOptions(options, props)
  );
  const result = buildResult(
    options,
    { fragment, fragmentName, resolverName },
    queryRes,
  );
  return result;
};

export const withSingle = (options) => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const Wrapped = props => {
    const res = useSingle(options, props);
    return <C {...props} {...res} />;
  };
  Wrapped.displayName = `with${typeName}`;
  return Wrapped;
};

// legacy default export
export default withSingle;