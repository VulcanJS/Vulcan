import { GraphQLSchema } from 'meteor/nova:lib';

const specificResolvers = {
  User: {
    async twitterUsername(user, args, context) {
      return context.Users.getTwitterName(user);
    }
  },
  Query: {
    async currentUser(root, args, context) {
      
      if(context && context.userId) {
        const currentUser = await context.BatchingUsers.findOne({_id: context.userId});
        return currentUser;
      }
      
      return null;
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'usersList',

    async resolver(root, {terms}, context, info) {
      let {selector, options} = context.Users.getParameters(terms);
      
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Users);
      
      const users = await context.BatchingUsers.find(selector, options);
      
      return users;
    },

  },

  single: {
    
    name: 'usersSingle',
    // to batch
    resolver(root, {documentId, slug}, context) {
      const selector = documentId ? {_id: documentId} : {'slug': slug};
      // get the user first so we can get a list of viewable fields specific to this user document
      const user = context.Users.findOne(selector);
      return context.Users.keepViewableFields(context.currentUser, context.Users, user);
    },
  
  },

  total: {
    
    name: 'usersTotal',
    
    async resolver(root, {terms}, context) {
      const {selector} = context.Users.getParameters(terms);
      const users = await context.BatchingUsers.find(selector);
      return users.length;
    },
  
  }
};

export default resolvers;
