import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import { getDisplayName } from './utils';
import withRemove from './withRemove.jsx'

export default function withEdit(WrappedComponent, options) {

  class WithEdit extends Component {
    constructor(...args) {
      super(...args);
    }

    render() {
      const { mutationName, fragment, resultQuery, collection } = this.props

      // if the mutation given to NovaForm isn't about editing an existing document, do nothing
      if (mutationName.indexOf('Edit') === -1) {

        return <WrappedComponent {...this.props} />

      } else {

        const collectionName = collection._name;

        const ComponentWithEdit = graphql(gql`
          mutation ${mutationName}($documentId: String, $set: ${collectionName}Input, $unset: ${collectionName}Unset) {
            ${mutationName}(documentId: $documentId, set: $set, unset: $unset) {
              ${fragment ? `...${fragment[0].name.value}` : resultQuery}
            }
          }
        `, {
          options: (props) => props.fragment ? {fragments: props.fragment} : {},
          props: ({ownProps, mutate}) => ({
            mutation: ({documentId, set, unset}) => {
              return mutate({ 
                variables: {documentId: documentId, set, unset}
              })
            }
          }),
        })(WrappedComponent);

        // add the remove mutation by default unless it's explicitly specified not to do it
        const ComponentToRender = this.props.noRemoveMutation ? ComponentWithEdit : withRemove(ComponentWithEdit);
  
        return <ComponentToRender {...this.props} />

      }
    }
  };

  WithEdit.displayName = `withEdit(${getDisplayName(WrappedComponent)}`;
  WithEdit.WrappedComponent = WrappedComponent;

  return hoistStatics(WithEdit, WrappedComponent);
};