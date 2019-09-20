/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation createMovie($data: CreateMovieData) {
    createMovie(data: $data) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }

Arguments: 

  - data: the document to insert

Child Props:

  - createMovie({ data })
    
*/

import React from 'react';
import gql from 'graphql-tag';
import { createClientTemplate } from 'meteor/vulcan:core';
import { extractCollectionInfo, extractFragmentInfo } from 'meteor/vulcan:lib';
import { useMutation } from '@apollo/react-hooks';

const buildCreateQuery = ({ typeName, fragmentName, fragment }) => {
  const query = gql`
    ${createClientTemplate({ typeName, fragmentName })}
    ${fragment}
  `;
  return query;
};

export const useCreate = (options) => {
  const { collectionName, collection } = extractCollectionInfo(options);
  const { fragmentName, fragment } = extractFragmentInfo(options, collectionName);

  const typeName = collection.options.typeName;
  const query = buildCreateQuery({ typeName, fragmentName, fragment });
  const [createFunc] = useMutation(query);
  // so the syntax is useCreate({collection: ...}, {data: ...})
  const extendedCreateFunc = (args) => createFunc({ variables: { data: args.data } });
  return [extendedCreateFunc];
};

export const withCreate = options => C => {
  const { collection } = extractCollectionInfo(options);
  const typeName = collection.options.typeName;
  const funcName = `create${typeName}`;
  const legacyError = () => {
    throw new Error('newMutation function has been removed. Use the "createFoo" syntax instead.');
  };
  const Wrapper = props => {
    const [createFunc] = useCreate(options);
    return <C
      {...{ [funcName]: createFunc }}
      newMutation={legacyError}
    />;
  };

  Wrapper.displayName = `withCreate${typeName}`;
  return Wrapper;
};

export default withCreate;
