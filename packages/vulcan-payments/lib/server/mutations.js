import { addGraphQLSchema, addGraphQLResolvers, addGraphQLMutation, Collections, addCallback } from 'meteor/vulcan:core';
// import Users from 'meteor/vulcan:users';
import { receiveAction } from '../server/integrations/stripe.js';

const resolver = {
  Mutation: {
    async paymentActionMutation(root, args, context) {
      return await receiveAction(args, context);
    },
  },
};
addGraphQLResolvers(resolver);
addGraphQLMutation('paymentActionMutation(token: JSON, userId: String, productKey: String, associatedCollection: String, associatedId: String, properties: JSON, coupon: String) : Chargeable');

function CreateChargeableUnionType() {
  const chargeableSchema = `union Chargeable = ${Collections.map(collection => collection.typeName).join(' | ')}`;
  addGraphQLSchema(chargeableSchema);
  return {};
}
addCallback('graphql.init.before', CreateChargeableUnionType);

const resolverMap = {
  Chargeable: {
    __resolveType(obj, context, info){
      return obj.__typename || null;
    },
  },
};
addGraphQLResolvers(resolverMap);