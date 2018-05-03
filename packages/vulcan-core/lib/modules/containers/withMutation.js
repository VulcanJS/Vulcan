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

export default function withMutation({name, args, subfields}) {

  let mutation;

  let subfieldSelection = '';
  if (subfields) {
    subfieldSelection = `__typename, ${subfields.reduce((final, current) => `, ${current}`, '')}`;
  }

  if (args) {
    const args1 = _.map(args, (type, name) => `$${name}: ${type}`); // e.g. $url: String
    const args2 = _.map(args, (type, name) => `${name}: $${name}`); // e.g. $url: url
    mutation = `
      mutation ${name}(${args1}) {
        ${name}(${args2})${subfieldSelection ? ` { ${subfieldSelection} }` : ''}
      }
    `
  } else {
    mutation = `
      mutation ${name} {
        ${name}${subfieldSelection ? ` { ${subfieldSelection}` : ''}
      }
    `
  }

  return graphql(gql`${mutation}`, {
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
