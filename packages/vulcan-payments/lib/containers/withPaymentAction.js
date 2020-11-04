import { graphql } from '@apollo/client/react/hoc';
import gql from 'graphql-tag';
import { getFragment, getFragmentName } from 'meteor/vulcan:core';

export default function withPaymentAction(options) {

  const fragment = options.fragment || getFragment(options.fragmentName);
  const fragmentName = getFragmentName(fragment) || fragmentName;

  const mutation = gql`
    mutation paymentActionMutation($token: JSON, $userId: String, $productKey: String, $associatedCollection: String, $associatedId: String, $properties: JSON, $coupon: String) {
      paymentActionMutation(token: $token, userId: $userId, productKey: $productKey, associatedCollection: $associatedCollection, associatedId: $associatedId, properties: $properties, coupon: $coupon) {
        __typename
        ...${fragmentName}
      }
    }
    ${fragment}
  `;

  return graphql(mutation, {
    alias: 'withPaymentAction',
    props: ({ownProps, mutate}) => ({
      paymentActionMutation: (vars) => {
        return mutate({ 
          variables: vars,
        });
      }
    }),
  });
}