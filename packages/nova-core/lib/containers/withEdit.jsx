import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import Telescope from 'meteor/nova:lib';

export default function withEdit(WrappedComponent) {

  const WithEdit = props => {

    const collection = props.collection,
          collectionName = collection._name,
          mutationName = collection.options.mutations.edit.name,
          fragmentName = collection.options.fragments.single.name,
          fragment = collection.options.fragments.single.fragment

    const ComponentWithEdit = graphql(gql`
      mutation ${mutationName}($documentId: String, $set: ${collectionName}Input, $unset: ${collectionName}Unset) {
        ${mutationName}(documentId: $documentId, set: $set, unset: $unset) {
          ...${fragmentName}
        }
      }
      ${fragment}
    `, {
      props: ({ ownProps, mutate }) => ({
        editMutation: (args) => {
          const { documentId, set, unset } = args;
          return mutate({ 
            variables: { documentId, set, unset }
          });
        }
      }),
    })(WrappedComponent);

    return <ComponentWithEdit {...props} />

  };

  WithEdit.displayName = `withEdit(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithEdit.WrappedComponent = WrappedComponent;

  return hoistStatics(WithEdit, WrappedComponent);
};