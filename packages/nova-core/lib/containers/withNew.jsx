import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import Telescope from 'meteor/nova:lib';

export default function withNew(WrappedComponent) {

  class WithNew extends Component {
    // constructor(...args) {
    //   super(...args);
    // }

    render() {

      const collection = this.props.collection,
            collectionName = collection._name,
            mutationName = collection.options.mutations.new.name,
            fragmentName = collection.options.fragments.single.name,
            fragment = collection.options.fragments.single.fragment

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
                updateQueries: ownProps.updateQueries
              })
            }
          }),
        })(WrappedComponent);

        return <ComponentWithNew {...this.props} />

      }
  };

  WithNew.displayName = `withNew(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithNew.WrappedComponent = WrappedComponent;

  return hoistStatics(WithNew, WrappedComponent);
};