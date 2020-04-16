import { addGraphQLResolvers, Connectors, addGraphQLQuery, addGraphQLSchema } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

addGraphQLQuery('currentUser: User');

const specificResolvers = {
  Query: {
    async currentUser(root, args, context) {
      let user = null;
      if (context && context.userId) {
        user = await Connectors.get(context.Users, context.userId);

        if (user.services) {
          Object.keys(user.services).forEach(key => {
            user.services[key] = {};
          });
        }
      }
      return user;
    },
  },
};

addGraphQLResolvers(specificResolvers);