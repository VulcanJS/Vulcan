import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName } from 'meteor/vulcan:core';

export default function withCreateCharge(options) {

  const fragment = options.fragment || getFragment(options.fragmentName);
  const fragmentName = getFragmentName(fragment) || fragmentName;

  const mutation = gql`
    mutation createChargeMutation($token: JSON, $userId: String, $productKey: String, $associatedCollection: String, $associatedId: String, $properties: JSON, $coupon: String) {
      createChargeMutation(token: $token, userId: $userId, productKey: $productKey, associatedCollection: $associatedCollection, associatedId: $associatedId, properties: $properties, coupon: $coupon) {
        __typename
        ...${fragmentName}
      }
    }
    ${fragment}
  `;

  return graphql(mutation, {
    alias: 'withCreateCharge',
    props: ({ownProps, mutate}) => ({
      createChargeMutation: (vars) => {
        return mutate({ 
          variables: vars,
        });
      }
    }),
  });
}