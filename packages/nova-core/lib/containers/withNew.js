/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation moviesNew($document: MoviesInput) {
    moviesNew(document: $document) {
      ...MoviesNewFormFragment
    }
  }

Arguments: 

  - document: the document to insert

Child Props:

  - newMutation(document)
    
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

export default function withNew(options) {

  // get options
  const { collection, fragmentName, fragment, queryName } = options,
        collectionName = collection._name,
        mutationName = collection.options.mutations.new.name,
        listResolverName = collection.options.resolvers.list.name,
        totalResolverName = collection.options.resolvers.total.name;

  // if a queryName is passed as prop, generate updateQueries function
  let updateQueries = {};
  if (queryName) {
    updateQueries = {
      [queryName]: (prev, { mutationResult }) => {

        // get new document to insert
        const newDocument = mutationResult.data[mutationName];

        // generate new list with updated total count and document inserted at top
        const newList = update(prev, {
          [listResolverName]: { $unshift: [newDocument] },
          [totalResolverName]: { $set: prev[totalResolverName] + 1 }
        });

        console.log(`// updated query ${queryName}:`)
        console.log(prev)
        console.log(newList)

        return newList;
      }
    }
  }

  // wrap component with graphql HoC
  return graphql(gql`
    mutation ${mutationName}($document: ${collectionName}Input) {
      ${mutationName}(document: $document) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    props: ({ownProps, mutate}) => ({
      newMutation: ({document}) => {

        console.log('// newMutation')
        console.log(updateQueries)
        
        return mutate({ 
          variables: { document },
          // updateQueries: props.updateQueries || updateQueries
        })
      }
    }),
  });

}

withNew.propTypes = {
  collection: React.PropTypes.object, // the collection to mutate
  fragmentName: React.PropTypes.string, // the name of the fragment
  fragment: React.PropTypes.object, // controls what data the mutation should return
  queryName: React.PropTypes.string, // the query to update on the client
}
