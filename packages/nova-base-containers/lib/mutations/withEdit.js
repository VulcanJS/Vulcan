import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withEdit(component, options) {
  debugger
  return graphql(gql`
    mutation ${props.mutationName}($documentId: String, $set: ${collectionName}Input, $unset: ${collectionName}Unset) {
      ${props.mutationName}(documentId: $documentId, set: $set, unset: $unset) {
        ${props.fragment ? `...${props.fragment[0].name.value}` : props.resultQuery}
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
  })(component);
};