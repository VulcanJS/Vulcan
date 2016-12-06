/*

HoC that provides a simple mutation that expects a single JSON object in return

Example usage:

export default withMutation({
  name: 'getEmbedlyData',
  args: {url: 'String'},
})(EmbedlyURL);

*/

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withMutation({name, args}) {

  const args1 = _.map(args, (type, name) => `$${name}: ${type}`); // e.g. $url: String
  const args2 = _.map(args, (type, name) => `${name}: $${name}`); // e.g. $url: url
  
  return graphql(gql`
    mutation ${name}(${args1}) {
      ${name}(${args2})
    }
  `, {
    name: name
  });
}