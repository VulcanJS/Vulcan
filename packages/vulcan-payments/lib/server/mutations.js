import { addGraphQLSchema, addGraphQLResolvers, addGraphQLMutation, Collections } from 'meteor/vulcan:core';
// import Users from 'meteor/vulcan:users';
import { createCharge } from '../server/integrations/stripe.js';

const resolver = {
  Mutation: {
    async createChargeMutation(root, args, context) {
      return await createCharge(args);
    },
  },
};
addGraphQLResolvers(resolver);
addGraphQLMutation('createChargeMutation(token: JSON, userId: String, productKey: String, associatedCollection: String, associatedId: String, properties: JSON) : Chargeable');

const chargeableSchema = `
  union Chargeable = ${Collections.map(collection => collection.typeName).join(' | ')}
`;
addGraphQLSchema(chargeableSchema);

const resolverMap = {
  Chargeable: {
    __resolveType(obj, context, info){
      return obj.__typename || null;
    },
  },
};
addGraphQLResolvers(resolverMap);