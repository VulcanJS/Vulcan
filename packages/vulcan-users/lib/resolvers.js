import { GraphQLSchema } from 'meteor/vulcan:lib';

const specificResolvers = {
  User: {
    twitterUsername(user, args, context) {
      return context.Users.getTwitterName(context.Users.findOne(user._id));
    }
  },
  Query: {
    currentUser(root, args, context) {
      let user = null;
      if (context && context.userId) {
        user = context.Users.findOne(context.userId);

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

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'usersList',

    resolver(root, {terms}, {currentUser, Users}, info) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Users.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      const users = Users.find(selector, options).fetch();

      // restrict documents fields
      const restrictedUsers = Users.restrictViewableFields(currentUser, Users, users);

      // prime the cache
      restrictedUsers.forEach(user => Users.loader.prime(user._id, user));

      return restrictedUsers;
    },

  },

  single: {

    name: 'usersSingle',

    async resolver(root, {documentId, slug}, {currentUser, Users}) {
      // don't use Dataloader if user is selected by slug
      const user = documentId ? await Users.loader.load(documentId) : Users.findOne({slug});
      return Users.restrictViewableFields(currentUser, Users, user);
    },

  },

  total: {

    name: 'usersTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.Users.getParameters(terms);
      return context.Users.find(selector).count();
    },

  }
};

export default resolvers;
