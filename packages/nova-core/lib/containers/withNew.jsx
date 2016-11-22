import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import Telescope from 'meteor/nova:lib';
import update from 'immutability-helper';

export default function withNew(WrappedComponent) {

  const WithNew = props => {

    const collection = props.collection,
          collectionName = collection._name,
          mutationName = collection.options.mutations.new.name,
          fragmentName = collection.options.fragments.single.name,
          fragment = collection.options.fragments.single.fragment,
          listResolverName = collection.options.resolvers.list.name,
          totalResolverName = collection.options.resolvers.total.name;


    console.log('new fragment',fragment);

    const updateQueries = {};
    updateQueries[props.queryName] = (prev, { mutationResult }) => {
      const newDocument = mutationResult.data[mutationName];
      const newList = update(prev, {
        [listResolverName]: { $unshift: [newDocument] },
        [totalResolverName]: { $set: prev[totalResolverName] + 1 }
      });
      return newList;
    };

    const ComponentWithNew = graphql(gql`
      mutation ${mutationName}($document: ${collectionName}Input) {
        ${mutationName}(document: $document) {
          ...${fragmentName}
        }
      }
      ${fragment}
    `, {
      props: ({ownProps, mutate}) => ({
        newMutation: ({document}) => {
          return mutate({ 
            variables: { document },
            updateQueries: updateQueries
          })
        }
      }),
    })(WrappedComponent);

    return <ComponentWithNew {...props} />
  };

  WithNew.displayName = `withNew(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithNew.WrappedComponent = WrappedComponent;

  return hoistStatics(WithNew, WrappedComponent);
};