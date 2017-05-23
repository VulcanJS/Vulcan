/*

HoC that provides a simple mutation that expects a single JSON object in return

Example usage:

export default withMutation({
  name: 'getEmbedData',
  args: {url: 'String'},
})(EmbedlyURL);

*/

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withMutation({name, args}) {

  let mutation;

  if (args) {
    const args1 = _.map(args, (type, name) => `$${name}: ${type}`); // e.g. $url: String
    const args2 = _.map(args, (type, name) => `${name}: $${name}`); // e.g. $url: url
    mutation = `
      mutation ${name}(${args1}) {
        ${name}(${args2})
      }
    `
  } else {
    mutation = `
      mutation ${name} {
        ${name}
      }
    `
  }

  return graphql(gql`${mutation}`, {
    props: ({ownProps, mutate}) => ({
      [name]: (vars) => {
        return mutate({ 
          variables: vars,
        });
      }
    }),
  });
}