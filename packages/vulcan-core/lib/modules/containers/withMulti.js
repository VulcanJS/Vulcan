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

import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  getSetting,
  Utils,
  multiClientTemplate,
  extractCollectionInfo,
  extractFragmentInfo,
} from 'meteor/vulcan:lib';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

export default function withMulti(options) {
  // console.log(options)

  let {
    limit = 10,
    pollInterval = getSetting('pollInterval', 20000),
    enableTotal = true,
    enableCache = false,
    extraQueries,
  } = options;

  // if this is the SSR process, set pollInterval to null
  // see https://github.com/apollographql/apollo-client/issues/1704#issuecomment-322995855
  pollInterval = typeof window === 'undefined' ? null : pollInterval;

  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const resolverName = collection.options.multiResolverName;

  // build graphql query from options
  const query = gql`
    ${multiClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
  `;

  return compose(
    // wrap component with Apollo HoC to give it access to the store
    withApollo,

    // wrap component with HoC that manages the terms object via its state
    withState('paginationTerms', 'setPaginationTerms', props => {
      // get initial limit from props, or else options
      const paginationLimit = (props.terms && props.terms.limit) || limit;
      const paginationTerms = {
        limit: paginationLimit,
        itemsPerPage: paginationLimit,
      };

      return paginationTerms;
    }),

    // wrap component with graphql HoC
    graphql(
      query,

      {
        alias: `with${Utils.pluralize(typeName)}`,

        // graphql query options
        options({ terms, paginationTerms, client: apolloClient, currentUser }) {
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
            graphQLOptions.fetchPolicy = options.fetchPolicy;
          }

          // see https://www.apollographql.com/docs/react/features/error-handling/#error-policies
          graphQLOptions.errorPolicy = 'all';

          // set to true if running into https://github.com/apollographql/apollo-client/issues/1186
          if (options.notifyOnNetworkStatusChange) {
            graphQLOptions.notifyOnNetworkStatusChange = options.notifyOnNetworkStatusChange;
          }

          return graphQLOptions;
        },

        // define props returned by graphql HoC
        props(props) {

          // see https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
          const refetch = props.data.refetch,
            // results = Utils.convertDates(collection, props.data[listResolverName]),
            results = props.data[resolverName] && props.data[resolverName].results,
            totalCount = props.data[resolverName] && props.data[resolverName].totalCount,
            networkStatus = props.data.networkStatus,
            loadingInitial = props.data.networkStatus === 1,
            loading = props.data.networkStatus === 1,
            loadingMore = props.data.networkStatus === 2,
            error = props.data.error,
            propertyName = options.propertyName || 'results';

          if (error) {
            // eslint-disable-next-line no-console
            console.log(error);
          }

          return {
            // see https://github.com/apollostack/apollo-client/blob/master/src/queries/store.ts#L28-L36
            // note: loading will propably change soon https://github.com/apollostack/apollo-client/issues/831
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
                      /*...props.ownProps.terms,*/ ...props.ownProps.paginationTerms,
                      limit: results.length + props.ownProps.paginationTerms.itemsPerPage,
                    }
                  : providedTerms;

              props.ownProps.setPaginationTerms(newTerms);
            },

            // incremental loading version (only load new content)
            // note: not compatible with polling
            loadMoreInc(providedTerms) {
              // get terms passed as argument or else just default to incrementing the offset
              const newTerms =
                typeof providedTerms === 'undefined'
                  ? {
                      ...props.ownProps.terms,
                      ...props.ownProps.paginationTerms,
                      offset: results.length,
                    }
                  : providedTerms;

              return props.data.fetchMore({
                variables: { input: { terms: newTerms } }, // ??? not sure about 'terms: newTerms'
                updateQuery(previousResults, { fetchMoreResult }) {
                  // no more post to fetch
                  if (!fetchMoreResult.data) {
                    return previousResults;
                  }
                  const newResults = {};
                  newResults[resolverName] = [
                    ...previousResults[resolverName],
                    ...fetchMoreResult.data[resolverName],
                  ];
                  // return the previous results "augmented" with more
                  return { ...previousResults, ...newResults };
                },
              });
            },

            fragmentName,
            fragment,
            ...props.ownProps, // pass on the props down to the wrapped component
            data: props.data,
          };
        },
      }
    )
  );
}
