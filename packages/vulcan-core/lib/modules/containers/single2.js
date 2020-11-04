import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
  getSetting, singleClientTemplate, Utils, extractCollectionInfo,
  extractFragmentInfo,
} from 'meteor/vulcan:lib';
import _merge from 'lodash/merge';
import { computeQueryVariables } from './variables';

const defaultInput = {
  enableCache: false,
  allowNull: false
};

export const singleQuery = ({
  typeName,
  fragmentName,
  fragment,
  extraQueries,
}) => {
  const query = gql`
    ${singleClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
  `;
  // debug
  //const { print } = require('graphql/language/printer');
  //console.log('****');
  //console.log(print(query));
  //console.log('****');

  return query;
};

/**
 * Create GraphQL useQuery options and variables based on props and provided options
 * @param {*} options 
 * @param {*} props
 */
const buildQueryOptions = (options, props) => {
  let {
    pollInterval = getSetting('pollInterval', 20000),
    // generic apollo graphQL options
    queryOptions = {}
  } = options;


  // if this is the SSR process, set pollInterval to null
  // see https://github.com/apollographql/apollo-client/issues/1704#issuecomment-322995855
  pollInterval = typeof window === 'undefined' ? null : pollInterval;

  // OpenCrud backwards compatibility
  const graphQLOptions = {
    variables: {
      ...computeQueryVariables(
        { ...options, input: _merge({}, defaultInput, options.input || {}) }, // needed to merge in defaultInput, could be improved
        props
      )
    },
    pollInterval // note: pollInterval can be set to 0 to disable polling (20s by default)
  };

  // see https://www.apollographql.com/docs/react/features/error-handling/#error-policies
  graphQLOptions.errorPolicy = 'all';

  return {
    ...graphQLOptions,
    ...queryOptions
  };
};

const buildResult = (
  options,
  { fragmentName, fragment, resolverName },
  returnedProps,
) => {
  const { /* ownProps, */ data, error } = returnedProps;
  const propertyName = options.propertyName || 'document';
  const props = {
    ...returnedProps,
    // Note: Scalar types like Dates are NOT converted. It should be done at the UI level.
    [propertyName]: data && data[resolverName] && data[resolverName].result,
    fragmentName,
    fragment,
    data,
    error
  };
  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return props;
};

export const useSingle2 = (options, props = {}) => {
  const { extraQueries } = options;
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);
  const typeName = collection.options.typeName;
  const resolverName = Utils.camelCaseify(typeName);

  const query = singleQuery({
    typeName, fragmentName, fragment, extraQueries
  });

  const queryRes = useQuery(
    query,
    buildQueryOptions(options, props)
  );
  const result = buildResult(
    options,
    { fragment, fragmentName, resolverName },
    queryRes,
  );
  return result;
};

export const withSingle2 = (options) => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const Wrapped = props => {
    const res = useSingle2(options, props);
    return <C {...props} {...res} />;
  };
  Wrapped.displayName = `with${typeName}`;
  return Wrapped;
};

// legacy default export
export default withSingle2;