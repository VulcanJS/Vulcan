import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withList (options) {

  // extract arguments from the options of the hoc
  const { queryName, collection, listResolverName, totalResolverName, fragment, fragmentName, ownPropsVariables = [] } = options;
  
  console.log("withList: ", queryName);
  // console.log(options);

  // default variables for the gql query list 
  const defaultQueryVariables = [
    {propName: 'offset', graphqlType: 'Int', defaultValue: 0, usedForTotal: false},
    {propName: 'limit', graphqlType: 'Int', defaultValue: 5, usedForTotal: false},
  ];

  // concat the default query variables with the ones from the props of the wrapped component
  const propsVariables = [...defaultQueryVariables, ...ownPropsVariables];

  console.log('props variables (default+ownProps)', propsVariables);

  // output something like: `$offset: Int, $limit: Int, $terms: Terms`
  const queryVariablesTypeDef = propsVariables.reduce((string, {propName, graphqlType}, index) => {
    // don't add ", " if the current typeDef is the first iteration
    const commaSeparation = index === 0 ? "" : ", ";
    
    return `${string}${commaSeparation}$${propName}: ${graphqlType}`;
  }, "");

  console.log('query variables type def', queryVariablesTypeDef);

  // output something like: `offset: $offset, limit: $limit, terms: $terms`
  const queryVariablesList = propsVariables.reduce((string, {propName}, index) => {
    // don't add ", " if the current typeDef is the first iteration
    const commaSeparation = index === 0 ? "" : ", ";
    
    return `${string}${commaSeparation}${propName}: $${propName}`;
  }, "");

  console.log('query variables list', queryVariablesList);

  // output something like: `terms: $terms`
  const queryVariablesTotal = propsVariables.filter(({usedForTotal}) => !!usedForTotal).reduce((string, {propName}, index) => {
    // don't add ", " if the current typeDef is the first iteration
    const commaSeparation = index === 0 ? "" : ", ";
    
    return `${string}${commaSeparation}${propName}: $${propName}`;
  }, "");

  console.log('query variables total', queryVariablesTotal);
  

  const callQueryVariablesTotal = !!queryVariablesTotal ? `(${queryVariablesTotal})` : "";

  return graphql(gql`
    query ${queryName}(${queryVariablesTypeDef}) {
      ${totalResolverName}${callQueryVariablesTotal}
      ${listResolverName}(${queryVariablesList}) {
        ...${fragmentName}
      }
    }
  `, {
    options(ownProps) {

      const queryVariables = propsVariables.reduce((variables, {propName, defaultValue}) => ({
        ...variables,
        [propName]: ownProps[propName] || defaultValue
      }), {});

      console.log('actual query variables', queryVariables);

      return {
        variables: queryVariables,
        fragments: fragment,
        // pollInterval: 20000,
      };
    },
    props(props) {

      const loading = props.data.loading,
            fetchMore = props.data.fetchMore,
            results = props.data[listResolverName],
            totalCount = props.data[totalResolverName];

      return {
        loading,
        results,
        totalCount,
        count: results && results.length,
        loadMore(event) {
          event.preventDefault();
          // basically, rerun the query 'getPostsList' with a new offset
          return fetchMore({
            variables: { offset: results.length },
            updateQuery(previousResults, { fetchMoreResult }) {
              // no more post to fetch
              if (!fetchMoreResult.data) {
                return previousResults;
              }
              const newResults = {};
              newResults[listResolverName] = [...previousResults[listResolverName], ...fetchMoreResult.data[listResolverName]];
              // return the previous results "augmented" with more
              return {...previousResults, ...newResults };
            },
          });
        },
        ...props.ownProps // pass on the props down to the wrapped component
      };
    },
  });
}