/*

HoC that provides a simple mutation that expects a single JSON object in return

Example usage:

export default withMutation({
  name: 'getEmbedData',
  args: {url: 'String'},
})(EmbedURL);

*/

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment } from 'meteor/vulcan:lib';

export default function withMutation({name, args, fragmentName}) {

  let mutation, fragment, fragmentBlock = '';

  if (fragmentName) {
    fragment = getFragment(fragmentName);
    fragmentBlock = `{
      ...${fragmentName}
    }`
  }
  
  if (args) {
    const args1 = _.map(args, (type, name) => `$${name}: ${type}`); // e.g. $url: String
    const args2 = _.map(args, (type, name) => `${name}: $${name}`); // e.g. $url: url
    mutation = `
      mutation ${name}(${args1}) {
        ${name}(${args2})${fragmentBlock}
      }
    `
  } else {
    mutation = `
      mutation ${name} {
        ${name}${fragmentBlock}
      }
    `
  }
  
  return graphql(gql`${mutation}${fragmentName ? fragment : ''}`, {
    alias: 'withMutation',
    props: ({ownProps, mutate}) => ({
      [name]: (vars) => {
        return mutate({ 
          variables: vars,
        });
      }
    }),
  });
}