/*

### withMulti

Paginated items container

Options:

  - collection: the collection to fetch the documents from
  - fragment: the fragment that defines which properties to fetch
  - fragmentName: the name of the fragment, passed to getFragment
  - limit: the number of documents to show initially
  - pollInterval: how often the data should be updated, in ms (set to 0 to disable polling)
  - input: the initial query input
    - filter
    - sort
    - search
    - offset
    - limit
    
*/

import React from 'react';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import gql from 'graphql-tag';
import {
  getSetting,
  multiClientTemplate,
  extractCollectionInfo,
  extractFragmentInfo,
} from 'meteor/vulcan:lib';
import merge from 'lodash/merge';
import get from 'lodash/get';

// default query input object
const defaultInput = {
  limit: 20,
  enableTotal: true,
  enableCache: false,
};

export const buildMultiQuery = ({ typeName, fragmentName, extraQueries, fragment }) => gql`
  ${multiClientTemplate({ typeName, fragmentName, extraQueries })}
  ${fragment}
`;

const getInitialPaginationInput = (options, props) => {
  // get initial limit from props, or else options, or else default value
  const limit = (props.input && props.input.limit) || (options.input && options.input.limit) || options.limit || defaultInput.limit;
  const paginationInput = {
    limit,
  };
  return paginationInput;
};

/**
 * Build the graphQL query options
 * @param {*} options
 * @param {*} state
 * @param {*} props
 */
const buildQueryOptions = (options, paginationInput = {}, props) => {

  let {
    input: optionsInput,
    pollInterval = getSetting('pollInterval', 20000),
    // generic graphQL options
    queryOptions = {},
  } = options;

  // get dynamic input from props
  const { input: propsInput = {} } = props;

  // merge static and dynamic inputs
  const input = merge({}, optionsInput, propsInput);

  // if this is the SSR process, set pollInterval to null
  // see https://github.com/apollographql/apollo-client/issues/1704#issuecomment-322995855
  pollInterval = typeof window === 'undefined' ? null : pollInterval;

  // get input from options, then props, then pagination
  // TODO: should be done during the merge with lodash
  const mergedInput = { ...defaultInput, ...options.input, ...input, ...paginationInput };

  const graphQLOptions = {
    variables: {
      input: mergedInput,
    },
    // note: pollInterval can be set to 0 to disable polling (20s by default)
    pollInterval,
  };

  // see https://www.apollographql.com/docs/react/features/error-handling/#error-policies
  queryOptions.errorPolicy = 'all';

  return {
    ...graphQLOptions,
    ...queryOptions, // allow overriding options
  };
};

const buildResult = (
  options,
  { fragmentName, fragment, resolverName },
  { setPaginationInput, paginationInput, initialPaginationInput },
  returnedProps
) => {
  //console.log('returnedProps', returnedProps);
  const { refetch, networkStatus, error, fetchMore, data, previousData, graphQLErrors } = returnedProps;
  // Note: Scalar types like Dates are NOT converted. It should be done at the UI level.
  const bestAvailableData = data ?? previousData;
  const results = bestAvailableData && bestAvailableData[resolverName] && bestAvailableData[resolverName].results;
  const totalCount = bestAvailableData && bestAvailableData[resolverName] && bestAvailableData[resolverName].totalCount;
  // see https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loadingInitial = networkStatus === 1;
  const loading = networkStatus === 1;
  const loadingMore = networkStatus === 3 || networkStatus === 2;
  const propertyName = options.propertyName || 'results';

  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return {
    // see https://github.com/apollostack/apollo-client/blob/master/src/queries/store.ts#L28-L36
    // note: loading will propably change soon https://github.com/apollostack/apollo-client/issues/831
    ...returnedProps,
    loading,
    loadingInitial,
    loadingMore,
    [propertyName]: results,
    totalCount,
    refetch,
    networkStatus,
    error,
    networkError: error && error.networkError,
    graphQLErrors,
    count: results && results.length,

    // regular load more (reload everything)
    loadMore(providedInput) {
      // if new terms are provided by presentational component use them, else default to incrementing current limit once
      const newInput = providedInput || {
        ...paginationInput,
        limit: results.length + initialPaginationInput.limit,
      };
      setPaginationInput(newInput);
    },

    // incremental loading version (only load new content)
    // note: not compatible with polling
    // TODO
    loadMoreInc(providedInput) {
      // get terms passed as argument or else just default to incrementing the offset

      const newInput = providedInput || {
        ...paginationInput,
        offset: results.length,
      };

      return fetchMore({
        variables: { input: newInput },
        updateQuery(previousResults, { fetchMoreResult }) {
          // no more post to fetch
          if (
            !(
              fetchMoreResult[resolverName] &&
              fetchMoreResult[resolverName].results &&
              fetchMoreResult[resolverName].results.length
            )
          ) {
            return previousResults;
          }
          const newResults = {
            ...previousResults,
            [resolverName]: { ...previousResults[resolverName] },
          }; // TODO: should we clone this object? => yes
          newResults[resolverName].results = [
            ...previousResults[resolverName].results,
            ...fetchMoreResult[resolverName].results,
          ];
          return newResults;
        },
      });
    },

    fragmentName,
    fragment,
    data,
  };
};

export const useMulti = (options, props = {}) => {
  const initialPaginationInput = getInitialPaginationInput(options, props);
  const [paginationInput, setPaginationInput] = useState(initialPaginationInput);

  let { extraQueries } = options;

  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const resolverName = collection.options.multiResolverName;

  // build graphql query from options
  const query = buildMultiQuery({ typeName, fragmentName, extraQueries, fragment });

  const queryOptions = buildQueryOptions(options, paginationInput, props);
  const queryRes = useQuery(query, queryOptions);

  // workaround for https://github.com/apollographql/apollo-client/issues/2810
  queryRes.graphQLErrors = get(queryRes, 'error.networkError.result.errors');
  
  const result = buildResult(
    options,
    { fragment, fragmentName, resolverName },
    { setPaginationInput, paginationInput, initialPaginationInput },
    queryRes
  );

  return result;
};

export const withMulti = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const Wrapped = props => {
    const res = useMulti(options, props);
    return <C {...props} {...res} />;
  };
  Wrapped.displayName = `with${typeName}`;
  return Wrapped;
};

export const useMulti2 = useMulti;
export const withMulti2 = withMulti;

// legacy
export default withMulti;
