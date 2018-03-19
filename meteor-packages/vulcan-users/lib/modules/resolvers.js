import { addGraphQLResolvers, Connectors } from 'meteor/vulcan:lib';

const specificResolvers = {
  Query: {
    async currentUser(root, args, context) {
      let user = null;
      if (context && context.userId) {
        user = await Connectors.get(context.Users, context.userId);

        if (user.services) {
          Object.keys(user.services).forEach((key) => {
            user.services[key] = {}
          });
        }
      }
      return user;
    },
  },
};

addGraphQLResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'UsersList',

    async resolver(root, { terms = {} }, {currentUser, Users}, info) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = await Users.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      const users = await Connectors.find(Users, selector, options);

      // restrict documents fields
      const restrictedUsers = Users.restrictViewableFields(currentUser, Users, users);

      // prime the cache
      restrictedUsers.forEach(user => Users.loader.prime(user._id, user));

      return restrictedUsers;
    },

  },

  single: {

    name: 'UsersSingle',

    async resolver(root, { documentId, slug }, {currentUser, Users}) {
      // don't use Dataloader if user is selected by slug
      const user = documentId ? await Users.loader.load(documentId) : (slug ? await Connectors.get(Users, {slug}): await Connectors.get(Users));
      return Users.restrictViewableFields(currentUser, Users, user);
    },

  },

  total: {

    name: 'UsersTotal',

    async resolver(root, { terms = {} }, { Users }) {
      const {selector} = await Users.getParameters(terms);
      return await Connectors.count(Users, selector);
    },

  }
};

export default resolvers;
