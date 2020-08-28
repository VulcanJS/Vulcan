/*

HoC that provides a simple mutation that expects a single JSON object in return

Example usage:

export default withMutation({
  name: 'getEmbedData',
  args: {url: 'String'},
})(EmbedURL);

*/

import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { getFragment } from 'meteor/vulcan:lib';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export const useRegisteredMutation = (options) => {
  const { name, args, fragmentName, mutationOptions = {} } = options;
  let mutation, fragment, fragmentBlock = '';

  if (fragmentName) {
    fragment = getFragment(fragmentName);
    fragmentBlock = `{
      ...${fragmentName}
    }`;
  }

  if (args && !isEmpty(args)) {
    const args1 = map(args, (type, name) => `$${name}: ${type}`); // e.g. $url: String
    const args2 = map(args, (type, name) => `${name}: $${name}`); // e.g. url: $url
    mutation = `
      mutation ${name}(${args1}) {
        ${name}(${args2})${fragmentBlock}
      }
    `;
  } else {
    mutation = `
      mutation ${name} {
        ${name}${fragmentBlock}
      }
    `;
  }
  const query = gql`${mutation}${fragmentName ? fragment : ''}`;

  const [mutateFunc] = useMutation(query, mutationOptions);
  const extendedMutateFunc = vars => mutateFunc({ variables: vars });
  return extendedMutateFunc;
};

export const withMutation = (options) => C => {
  const Wrapper = props => {
    const mutation = useRegisteredMutation(options);
    return (
      <C {...props} {...{ [options.name]: mutation }} />
    );
  };
  Wrapper.displayName = 'withMutation';
  return Wrapper;
};

export default withMutation;