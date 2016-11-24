import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import hoistStatics from 'hoist-non-react-statics'
import Telescope from 'meteor/nova:lib';
import update from 'immutability-helper';

export default function withNew(WrappedComponent) {

  class WithNew extends Component {
  // const WithNew = props => {
    render() {
      const props = this.props;
      console.log(props)

      const { collection, fragmentName, fragment } = props,
            collectionName = collection._name,
            mutationName = collection.options.mutations.new.name,
            listResolverName = collection.options.resolvers.list.name,
            totalResolverName = collection.options.resolvers.total.name;

      // if a queryName is passed as prop, build an "automated" updateQueries function
      let updateQueries = {};
      if (props.queryName) {
        updateQueries = {
          [props.queryName]: (prev, { mutationResult }) => {
            console.log(prev)
            console.log(mutationResult)
            const newDocument = mutationResult.data[mutationName];
            console.log(newDocument)
            const newList = update(prev, {
              [listResolverName]: { $unshift: [newDocument] },
              [totalResolverName]: { $set: prev[totalResolverName] + 1 }
            });
            console.log(newList)
            return newList;
          }
        }
      }

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
              updateQueries: props.updateQueries || updateQueries
            })
          }
        }),
      })(WrappedComponent);

      return <ComponentWithNew {...props} />
    }
  }

  WithNew.displayName = `withNew(${Telescope.utils.getComponentDisplayName(WrappedComponent)}`;
  WithNew.WrappedComponent = WrappedComponent;
  return WithNew;
  return hoistStatics(WithNew, WrappedComponent);
};