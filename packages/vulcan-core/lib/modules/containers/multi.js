/*

### withMulti

Paginated items container

Options:

  - collection: the collection to fetch the documents from
  - fragment: the fragment that defines which properties to fetch
  - fragmentName: the name of the fragment, passed to getFragment
  - limit: the number of documents to show initially
  - pollInterval: how often the data should be updated, in ms (set to 0 to disable polling)
  - terms: an object that defines which documents to fetch

Props Received:

  - terms: an object that defines which documents to fetch

Terms object can have the following properties:

  - view: String
  - userId: String
  - cat: String
  - date: String
  - after: String
  - before: String
  - enableTotal: Boolean
  - enableCache: Boolean
  - listId: String
  - query: String # search query
  - postId: String
  - limit: String
  
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
  deprecate
} from 'meteor/vulcan:lib';

export const buildMultiQuery = ({
  typeName, fragmentName, extraQueries, fragment
}) => (gql`
    ${multiClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
  `
  );

const defaultPaginationTerms = ({ limit = 10 }, props) => {
  // get initial limit from props, or else options
  const paginationLimit = (props.terms && props.terms.limit) || limit;
  const paginationTerms = {
    limit: paginationLimit,
    itemsPerPage: paginationLimit,
  };
  return paginationTerms;
};


/**
 * Build the graphQL query options
 * @param {*} options
 * @param {*} state
 * @param {*} props
 */
const buildQueryOptions = (options, { paginationTerms }, { terms }) => {
  let {
    pollInterval = getSetting('pollInterval', 20000),
    enableTotal = true,
    enableCache = false,
    // generic graphQL options
    queryOptions = {}
  } = options;
  // if this is the SSR process, set pollInterval to null
  // see https://github.com/apollographql/apollo-client/issues/1704#issuecomment-322995855
  pollInterval = typeof window === 'undefined' ? null : pollInterval;

  // get terms from options, then props, then pagination
  const mergedTerms = { ...options.terms, ...terms, ...paginationTerms };

  const graphQLOptions = {
    variables: {
      input: {
        terms: mergedTerms,
        enableCache,
        enableTotal,
      },
    },
    // note: pollInterval can be set to 0 to disable polling (20s by default)
    pollInterval,
  };

  if (options.fetchPolicy) {
    deprecate('1.13.3', 'use the "queryOptions" object to pass options to the underlying Apollo hooks (hook: useMulti, option: fetchPolicy)');
    graphQLOptions.fetchPolicy = options.fetchPolicy;
  }
  if (typeof options.pollInterval !== 'undefined') {
    deprecate('1.13.3', 'use the "queryOptions" object to pass options to the underlying Apollo hooks (hook: useMulti, option: pollInterval)');
  }
  // set to true if running into https://github.com/apollographql/apollo-client/issues/1186
  if (options.notifyOnNetworkStatusChange) {
    deprecate('1.13.3', 'use the "queryOptions" object to pass options to the underlying Apollo hooks (hook: useMulti, option: notifyOnNetworkStatusChange)');
    graphQLOptions.notifyOnNetworkStatusChange = options.notifyOnNetworkStatusChange;
  }

  // see https://www.apollographql.com/docs/react/features/error-handling/#error-policies
  graphQLOptions.errorPolicy = 'all';


  return {
    ...graphQLOptions,
    ...queryOptions // allow overriding options
  };
};

const buildResult = (options, { fragmentName, fragment, resolverName }, { setPaginationTerms, paginationTerms }, returnedProps) => {
  //console.log('returnedProps', returnedProps);
  const { refetch, networkStatus, error, fetchMore, data } = returnedProps;
  // results = Utils.convertDates(collection, props.data[listResolverName]),
  const results = data && data[resolverName] && data[resolverName].results;
  const totalCount = data && data[resolverName] && data[resolverName].totalCount;
  // see https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loadingInitial = networkStatus === 1;
  const loading = networkStatus === 1;
  const loadingMore = networkStatus === 3;
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
    count: results && results.length,

    // regular load more (reload everything)
    loadMore(providedTerms) {
      // if new terms are provided by presentational component use them, else default to incrementing current limit once
      const newTerms =
        typeof providedTerms === 'undefined'
          ? {
            /*...props.ownProps.terms,*/
            ...paginationTerms,
            limit: results.length + paginationTerms.itemsPerPage,
          }
          : providedTerms;
      setPaginationTerms(newTerms);
    },

    // incremental loading version (only load new content)
    // note: not compatible with polling
    loadMoreInc(providedTerms) {
      // get terms passed as argument or else just default to incrementing the offset

      const newTerms =
        typeof providedTerms === 'undefined'
          ? {
            ...paginationTerms,
            offset: results.length,
          }
          : providedTerms;

      return fetchMore({
        variables: { input: { terms: newTerms } }, // ??? not sure about 'terms: newTerms'
        updateQuery(previousResults, { fetchMoreResult }) {
          // no more post to fetch
          if (!(
            fetchMoreResult[resolverName]
            && fetchMoreResult[resolverName].results
            && fetchMoreResult[resolverName].results.length
          )) {
            return previousResults;
          }
          const newResults = {
            ...previousResults,
            [resolverName]: { ...previousResults[resolverName] }
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

export const useMulti = (options, props) => {
  const [paginationTerms, setPaginationTerms] = useState(defaultPaginationTerms(options, props));

  let {
    extraQueries,
  } = options;


  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const resolverName = collection.options.multiResolverName;

  // build graphql query from options
  const query = buildMultiQuery({ typeName, fragmentName, extraQueries, fragment });

  const queryOptions = buildQueryOptions(options, { paginationTerms }, props);
  const queryRes = useQuery(query, queryOptions);

  const result = buildResult(
    options,
    { fragment, fragmentName, resolverName },
    { setPaginationTerms, paginationTerms },
    queryRes
  );

  return result;

};

export const withMulti = (options) => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const Wrapped = props => {
    const res = useMulti(options, props);
    return <C {...props} {...res} />;
  };
  Wrapped.displayName = `with${typeName}`;
  return Wrapped;
};

// legacy
export default withMulti;
