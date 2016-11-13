import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics';
import update from 'immutability-helper';
import { getDisplayName } from './utils';

export default function withRemove(WrappedComponent, options) {

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
              updateQueries: {
                // ex: getPostsList
                [`get${Telescope.utils.camelToSpaces(collectionName)}List`]: (prev, { mutationResult }) => {
                  // filter the list to get a new one without the document
                  const listWithoutDocument = prev[collectionName].filter(doc => doc._id !== documentId);
                  // update the query
                  const newList = update(prev, {
                    // ex: posts
                    [collectionName]: {
                      $set: listWithoutDocument,
                    },
                    // ex: postsListTotal
                    [`${collectionName}ListTotal`]: {
                      $set: prev.postsListTotal - 1
                    }
                  });
                  return newList;
                },
              }
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