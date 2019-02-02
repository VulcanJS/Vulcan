const { onStart } = require('./apollo_server2');
// createApolloServer when server startup
Meteor.startup(onStart);
