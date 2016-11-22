import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics';
import update from 'immutability-helper';
import Telescope from 'meteor/nova:lib';

export default function withRemove(WrappedComponent) {

  const WithRemove = props => {

    const collection = props.collection,
          collectionName = collection._name,
          mutationName = collection.options.mutations.remove.name,
          fragmentName = collection.options.fragments.single.name,
          fragment = collection.options.fragments.single.fragment,
          listResolverName = collection.options.resolvers.list.name,
          totalResolverName = collection.options.resolvers.total.name;

    const ComponentWithRemove = graphql(gql`
      mutation ${mutationName}($documentId: String) {
        ${mutationName}(documentId: $documentId) {
          ...${fragmentName}
        }
      }
      ${fragment}
    `, {
      props: ({ ownProps, mutate }) => ({
        removeMutation: ({ documentId }) => {

          const updateQueries = {
            [props.queryName]: (prev, { mutationResult }) => {
              // filter the list to get a new one without the document
              const listWithoutDocument = prev[listResolverName].filter(doc => doc._id !== documentId);
              // update the query
              const newList = update(prev, {
                [listResolverName]: { $set: listWithoutDocument }, // ex: postsList
                [totalResolverName]: { $set: prev.postsListTotal - 1 } // ex: postsListTotal
              });
              return newList;
            }
          }

          return mutate({ 
            variables: { documentId },
            updateQueries: props.updateQueries || updateQueries
          })
        },
      }),
    })(WrappedComponent);

    return <ComponentWithRemove {...props} />
  };

  WithRemove.displayName = `withRemove(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithRemove.WrappedComponent = WrappedComponent;

  return hoistStatics(WithRemove, WrappedComponent);
};