import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import Telescope from 'meteor/nova:lib';

export default function withNew(WrappedComponent, options) {

  class WithNew extends Component {
    constructor(...args) {
      super(...args);
    }

    render() {

      // if the NovaForm mutation isn't about creating a new document (it already has one), do nothing
      if (this.props.document) {

        return <WrappedComponent {...this.props} />

      } else {

        const { mutationName, fragment, resultQuery, collection } = this.props;

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

  WithNew.displayName = `withNew(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithNew.WrappedComponent = WrappedComponent;

  return hoistStatics(WithNew, WrappedComponent);
};