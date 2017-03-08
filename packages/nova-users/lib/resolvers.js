import { GraphQLSchema } from 'meteor/nova:lib';

const specificResolvers = {
  User: {
    twitterUsername(user, args, context) {
      return context.Users.getTwitterName(context.Users.findOne(user._id));
    }
  },
  Query: {
    currentUser(root, args, context) {
      return context && context.userId ? context.Users.findOne(context.userId) : null;
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'usersList',

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Users.getParameters(terms);
      
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Users);
      
      return context.Users.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'usersSingle',
    
    resolver(root, {documentId, slug}, context) {
      const selector = documentId ? {_id: documentId} : {'slug': slug};
      // get the user first so we can get a list of viewable fields specific to this user document
      const user = context.Users.findOne(selector);
      return context.Users.keepViewableFields(context.currentUser, context.Users, user);
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
