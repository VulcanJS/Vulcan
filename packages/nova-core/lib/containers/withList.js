/*

### withList

Paginated items container

Options: 

  - queryName: an arbitrary name for the query
  - collection: the collection to fetch the documents from
  - fragment: the fragment that defines which properties to fetch
  - limit: the number of documents to show initially

Props Received: 

  - terms: an object that defines which documents to fetch

Terms object can have the following properties:

  - view: String
  - userId: String
  - cat: String
  - date: String
  - after: String
  - before: String
  - enableCache: Boolean
  - listId: String
  - query: String # search query
  - postId: String
  - limit: String
         
*/
     
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import { getSetting } from 'meteor/nova:core';
import Mingo from 'mingo';
import { compose, withState } from 'recompose';

const withList = (options) => {

  const { queryName, collection, fragment, limit } = options,
        fragmentName = fragment.definitions[0].name.value,
        listResolverName = collection.options.resolvers.list.name,
        totalResolverName = collection.options.resolvers.total.name;

  return compose(

    // wrap component with HoC that manages the terms object via its state
    withState('terms', 'setTerms', props => {

      // either get initial limit from options, or default to settings
      const initialLimit = typeof limit === 'undefined' ? getSetting('postsPerPage', 10) : limit;
      const terms = {
        limit: initialLimit, 
        itemsPerPage: initialLimit, 
        ...props.terms
      };

      return terms;
    }),

    // wrap component with graphql HoC
    graphql(

      // build graphql query from options
      gql`
        query ${queryName}($terms: JSON) {
          ${totalResolverName}(terms: $terms)
          ${listResolverName}(terms: $terms) {
            ...${fragmentName}
          }
        }
        ${fragment}
      `,

      {
        
        // graphql query options
        options(ownProps) {
          // console.log(ownProps)
          return {
            variables: {
              terms: ownProps.terms,
            },
            reducer: (previousResults, action) => {

              // see queryReducer function defined below
              return queryReducer(previousResults, action, collection, ownProps, listResolverName, totalResolverName, queryName);
            
            },
            pollInterval: 20000,
          };
        },

        // define props returned by graphql HoC
        props(props) {

          const refetch = props.data.refetch,
                results = props.data[listResolverName],
                totalCount = props.data[totalResolverName],
                networkStatus = props.data.networkStatus;

          return {
            // see https://github.com/apollostack/apollo-client/blob/master/src/queries/store.ts#L28-L36
            // note: loading will propably change soon https://github.com/apollostack/apollo-client/issues/831
            loading: networkStatus === 1, // networkStatus = 1 <=> the graphql container is loading
            results,
            totalCount,
            refetch,
            networkStatus,
            count: results && results.length,
            loadMore(providedTerms) {
              // if new terms are provided by presentational component use them, else default to incrementing current limit once
              const newTerms = typeof providedTerms === 'undefined' ? { ...props.ownProps.terms, limit: results.length + props.ownProps.terms.itemsPerPage } : providedTerms;
              props.ownProps.setTerms(newTerms);
            },
            // // incremental loading version:
            // loadMore(variables) {

            //   // get variables passed as argument or else just default to incrementing the offset
            //   variables = typeof variables === 'undefined' ? { offset: results.length } : variables;

            //   return fetchMore({
            //     variables,
            //     updateQuery(previousResults, { fetchMoreResult }) {
            //       // no more post to fetch
            //       if (!fetchMoreResult.data) {
            //         return previousResults;
            //       }
            //       const newResults = {};
            //       newResults[listResolverName] = [...previousResults[listResolverName], ...fetchMoreResult.data[listResolverName]];
            //       // return the previous results "augmented" with more
            //       return {...previousResults, ...newResults };
            //     },
            //   });
            // },
            fragmentName,
            fragment,
            ...props.ownProps // pass on the props down to the wrapped component
          };
        },
      }
    )
  );
}


// define query reducer separately
const queryReducer = (previousResults, action, collection, ownProps, listResolverName, totalResolverName, queryName) => {

  const newMutationName = `${collection._name}New`;
  const editMutationName = `${collection._name}Edit`;
  const removeMutationName = `${collection._name}Remove`;

  let newResults = previousResults;

  // get mongo selector and options objects based on current terms
  const { selector, options } = collection.getParameters(ownProps.terms);
  const mingoQuery = Mingo.Query(selector);

  // function to remove a document from a results object, used by edit and remove cases below
  const removeFromResults = (results, document) => {
    const listWithoutDocument = results[listResolverName].filter(doc => doc._id !== document._id);
    const newResults = update(results, {
      [listResolverName]: { $set: listWithoutDocument }, // ex: postsList
      [totalResolverName]: { $set: results[totalResolverName] - 1 } // ex: postsListTotal
    });
    return newResults;
  }

  // add document to a results object
  const addToResults = (results, document) => {

    return update(results, {
      [listResolverName]: { $unshift: [document] },
      [totalResolverName]: { $set: results[totalResolverName] + 1 }
    });
  }

  // reorder results according to a sort
  const reorderResults = (results, sort) => {
    const cursor = mingoQuery.find(results[listResolverName]);
    const sortedList = cursor.sort(sort).all();
    // console.log('sortedList: ', sortedList)
    results[listResolverName] = sortedList;
    return results;
  }

  // console.log('// withList reducer');
  // console.log('queryName: ', queryName);
  // console.log('terms: ', ownProps.terms);
  // console.log('selector: ', selector);
  // console.log('options: ', options);
  // console.log('previousResults: ', previousResults);
  // console.log('previous titles: ', _.pluck(previousResults[listResolverName], 'title'))
  // console.log('action: ', action);

  switch (action.operationName) {

    case newMutationName:
      // if new document belongs to current list (based on view selector), add it
      const newDocument = action.result.data[newMutationName];
      if (mingoQuery.test(newDocument)) {
        newResults = addToResults(previousResults, newDocument);
        newResults = reorderResults(newResults, options.sort);
      }
      // console.log('** new **')
      // console.log('newDocument: ', newDocument)
      // console.log('belongs to list: ', mingoQuery.test(newDocument))
      break;

    case editMutationName:
      const editedDocument = action.result.data[editMutationName];
      if (mingoQuery.test(editedDocument)) {
        // edited document belongs to the list
        if (!_.findWhere(previousResults[listResolverName], {_id: editedDocument._id})) {
          // if document wasn't already in list, add it
          newResults = addToResults(previousResults, editedDocument);
        }
        newResults = reorderResults(newResults, options.sort);
      } else {
        // if edited doesn't belong to current list anymore (based on view selector), remove it
        newResults = removeFromResults(previousResults, editedDocument);
      }
      // console.log('** edit **')
      // console.log('editedDocument: ', editedDocument)
      // console.log('belongs to list: ', mingoQuery.test(editedDocument))
      // console.log('exists in list: ', !!_.findWhere(previousResults[listResolverName], {_id: editedDocument._id}))
      break;

    case removeMutationName:
      const removedDocument = action.result.data[removeMutationName];
      newResults = removeFromResults(previousResults, removedDocument);
      // console.log('** remove **')
      // console.log('removedDocument: ', removedDocument)
      break;

    case 'vote':
      // console.log('** vote **')
      // reorder results in case vote changed the order
      newResults = reorderResults(newResults, options.sort);
      break;

    default: 
      // console.log('** no action **')
      return previousResults;
  }

  // console.log('newResults: ', newResults)
  // console.log('new titles: ', _.pluck(newResults[listResolverName], 'title'))
  // console.log('\n\n')

  // copy over arrays explicitely to ensure new sort is taken into account
  return {
    [listResolverName]: [...newResults[listResolverName]],
    [totalResolverName]: newResults[totalResolverName],
  }

}

export default withList;