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

const defaultOptions = {
  cacheMaxAge: 300,
};

const resolvers = {

  multi: {

    async resolver(root, { input = {} }, {currentUser, Users}, { cacheControl }) {

      const { terms = {}, enableCache = false, enableTotal = true } = input;

      if (cacheControl && enableCache) {
        const maxAge = defaultOptions.cacheMaxAge;
        cacheControl.setCacheHint({ maxAge });
      }

      // get selector and options from terms and perform Mongo query
      let {selector, options} = await Users.getParameters(terms);
      options.skip = terms.offset;
      const users = await Connectors.find(Users, selector, options);

      // restrict documents fields
      const restrictedUsers = Users.restrictViewableFields(currentUser, Users, users);

      // prime the cache
      restrictedUsers.forEach(user => Users.loader.prime(user._id, user));
      
      const data = { results: restrictedUsers };
      
      if (enableTotal) {
        // get total count of documents matching the selector
        data.totalCount = await Connectors.count(Users, selector);
      }

      return data;
    },

  },

  single: {

    async resolver(root, { input = {} }, { currentUser, Users }, { cacheControl }) {
      
      const { selector = {}, enableCache = false } = input;
      const { documentId, slug } = selector;

      if (cacheControl && enableCache) {
        const maxAge = defaultOptions.cacheMaxAge;
        cacheControl.setCacheHint({ maxAge });
      }

      // don't use Dataloader if user is selected by slug
      const user = documentId ? await Users.loader.load(documentId) : (slug ? await Connectors.get(Users, {slug}): await Connectors.get(Users));
      return { result: Users.restrictViewableFields(currentUser, Users, user) };
    },

  },
  
};

export default resolvers;
