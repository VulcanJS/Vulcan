import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import Telescope from 'meteor/nova:lib';
// import withRemove from './withRemove.jsx'

export default function withEdit(WrappedComponent) {

  class WithEdit extends Component {
    // constructor(...args) {
    //   super(...args);
    // }

    render() {
        
      const collection = this.props.collection,
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

      return <ComponentWithEdit {...this.props} />

    }
  };

  WithEdit.displayName = `withEdit(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithEdit.WrappedComponent = WrappedComponent;

  return hoistStatics(WithEdit, WrappedComponent);
};