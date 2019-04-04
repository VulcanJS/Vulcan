const { onStart } = require('./apollo_server');
// createApolloServer when server startup
Meteor.startup(onStart);
