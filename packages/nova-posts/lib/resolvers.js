import { GraphQLSchema } from 'meteor/nova:core';

const specificResolvers = {
  Post: {
    user(post, args, context) {
      return context.Users.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'postsList',

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Posts.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Posts);
      return context.Posts.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'postsSingle',

    resolver(root, {documentId}, context) {
      const post = context.Posts.findOne({_id: documentId});
      return context.Users.keepViewableFields(context.currentUser, context.Posts, post);
    },
  
  },

  total: {
    
    name: 'postsTotal',
    
    resolver(root, {terms}, context) {
      const {selector} = context.Posts.getParameters(terms);
      return context.Posts.find(selector).count();
    },
  
  }
};

export default resolvers;
