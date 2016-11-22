import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withList2 (config) {

  // extract arguments from the options of the hoc
  // const { queryName, collection, listResolverName, totalResolverName, fragment, fragmentName, ownPropsVariables = [] } = options;
  const { collection, options = {variables: {}} } = config;

  // from the collection, get the info following the naming convention 
  const collectionName = collection._name;
  const queryName = `get${Telescope.utils.capitalize(collectionName)}List`;
  // ex: getPostsList
  const listResolverName = `${collectionName}List`;
  // ex: postsList
  const totalResolverName = `${collectionName}ListTotal`;
  // ex: postsListTotal
  const fragment = options.fragment || collection.fragments.list;
  // ex: Posts.fragments.list
  const fragmentName = fragment[0].name.value;
  // ex: postInfoInList ; or whatever it's called, we grab it directly in the fragment

  // console.log("withList: ", queryName);
  // console.log(options);

  // default variables for the gql query list 
  const defaultQueryVariables = {
    offset: {
      type: 'Int',
      defaultValue: 0,
      usedForTotal: false,
    },
    limit: {
      type: 'Int',
      defaultValue: 5,
      usedForTotal: false,
    }
  };

  // concat the default query variables with the ones from the props of the wrapped component
  const propsVariables = {...defaultQueryVariables, ...options.variables};

  // console.log('props variables (default+ownProps)', propsVariables);

  // output something like: `$offset: Int, $limit: Int, $terms: Terms`
  const queryVariablesTypeDef = Object.keys(propsVariables).reduce((string, variableName, index) => {

    const { type } = propsVariables[variableName];

    // don't add ", " if the current typeDef is the first iteration
    const commaSeparation = index === 0 ? "" : ", ";
    
    return `${string}${commaSeparation}$${variableName}: ${type}`;
  }, "");

  // console.log('query variables type def', queryVariablesTypeDef);

  // output something like: `offset: $offset, limit: $limit, terms: $terms`
  const queryVariablesList = Object.keys(propsVariables).reduce((string, variableName, index) => {
    // don't add ", " if the current typeDef is the first iteration
    const commaSeparation = index === 0 ? "" : ", ";
    
    return `${string}${commaSeparation}${variableName}: $${variableName}`;
  }, "");

  // console.log('query variables list', queryVariablesList);

  // output something like: `terms: $terms`
  const queryVariablesTotalName = Object.keys(propsVariables).filter(variableName => !!propsVariables[variableName].usedForTotal);
  const queryVariablesTotal = queryVariablesTotalName.reduce((string, variableName, index) => {
    // don't add ", " if the current typeDef is the first iteration
    const commaSeparation = index === 0 ? "" : ", ";
    
    return `${string}${commaSeparation}${variableName}: $${variableName}`;
  }, "");

  // console.log('query variables total', queryVariablesTotal);
  

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

      const queryVariables = Object.keys(propsVariables).reduce((variables, variableName) => {
        
        const { defaultValue } = propsVariables[variableName];

        return {
          ...variables,
          [variableName]: ownProps[variableName] || defaultValue,
        };
      }, {});

      // console.log('actual query variables', queryVariables);

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