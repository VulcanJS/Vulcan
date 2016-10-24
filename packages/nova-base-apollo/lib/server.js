import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

createApolloServer({
  schema,
});

// notes:
// it was done before without Meteor integration : https://github.com/TelescopeJS/Telescope/blob/8e9b89eebc3093d5b5b5d4e497f15f13d641743a/packages/nova-base-apollo/lib/server.js
// as Apollo Meteor integration has been updated (0.1.0), it's better to use it (handle current meteor user)!
// what's done under the hood : https://github.com/apollostack/meteor-integration/blob/master/main-server.js
