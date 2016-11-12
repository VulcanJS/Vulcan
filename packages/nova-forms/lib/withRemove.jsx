import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import { getDisplayName } from './utils';

export default function withEdit(WrappedComponent, options) {

  class WithRemove extends Component {
    constructor(...args) {
      super(...args);
    }

    render() {
      const { fragment, resultQuery, collection } = this.props;
      const collectionName = collection._name;

      const ComponentWithMutation = graphql(gql`
        mutation ${collectionName}Remove($documentId: String) {
          ${collectionName}Remove(documentId: $documentId) {
            ${fragment ? `...${fragment[0].name.value}` : resultQuery}
          }
        }
      `, {
        options: (props) => props.fragment ? {fragments: props.fragment} : {},
        props: ({ownProps, mutate}) => ({
          removeMutation: ({documentId}) => {
            return mutate({ 
              variables: {documentId},
              // should call updateQueries here
            })
          },
        }),
      })(WrappedComponent);

      return <ComponentWithMutation {...this.props} />
    }
  };

  WithRemove.displayName = `withRemove(${getDisplayName(WrappedComponent)}`;
  WithRemove.WrappedComponent = WrappedComponent;

  return hoistStatics(WithRemove, WrappedComponent);
};