import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import { getDisplayName } from './utils';

export default function withNew(WrappedComponent, options) {

  class WithNew extends Component {
    constructor(...args) {
      super(...args);
    }

    render() {
      const { mutationName, fragment, resultQuery, collection } = this.props

      // if the mutation given to NovaForm isn't about creating a new document, do nothing
      if (mutationName.indexOf('New') === -1) {

        return <WrappedComponent {...this.props} />

      } else {

        const collectionName = collection._name;

        const ComponentWithMutation = graphql(gql`
          mutation ${mutationName}($document: ${collectionName}Input) {
            ${mutationName}(document: $document) {
              ${fragment ? `...${fragment[0].name.value}` : resultQuery}
            }
          }
        `, {
          options: (props) => props.fragment ? {fragments: props.fragment} : {},
          props: ({ownProps, mutate}) => ({
            mutation: ({document}) => {
              return mutate({ 
                variables: {document: document},
                updateQueries: ownProps.updateQueries
              })
            }
          }),
        })(WrappedComponent);

        return <ComponentWithMutation {...this.props} />

      }
    }
  };

  WithNew.displayName = `withNew(${getDisplayName(WrappedComponent)}`;
  WithNew.WrappedComponent = WrappedComponent;

  return hoistStatics(WithNew, WrappedComponent);
};