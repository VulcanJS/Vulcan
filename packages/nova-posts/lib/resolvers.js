import { GraphQLSchema } from 'meteor/nova:core';

const specificResolvers = {
  Post: {
    async user(post, args, context) {
      const user = await context.BatchingUsers.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
      return user;
    },
  },
  Mutation: {
    async increasePostViewCount(root, { postId }, context) {
      const ret = await context.BatchingPosts.update({_id: postId}, { $inc: { viewCount: 1 }});
      return ret;
    }
  }
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'postsList',

    async resolver(root, {terms}, context, info) {
      try {
        let {selector, options} = context.Posts.getParameters(terms);
        options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
        options.skip = terms.offset;
        options.fields = context.getViewableFields(context.currentUser, context.Posts);
        
        const posts = await context.BatchingPosts.find(selector, options);
        
        return posts;
      } catch(error) {
        console.error('[Resolver error]', error);
        return [];
      }
    },

  },

  single: {
    
    name: 'postsSingle',

    async resolver(root, {documentId/*, slug*/}, context) {
      try {
        // const selector = documentId ? {_id: documentId} : {'slug': slug};
        const post = await context.BatchingPosts.findOne({_id: documentId});
        return context.Users.keepViewableFields(context.currentUser, context.Posts, post);
      } catch(error) {
        console.error('[Resolver error]', error);
        return null;
      }
    },
  
  },

  total: {
    
    name: 'postsTotal',
    
    async resolver(root, {terms}, context) {
      try {
        const {selector} = context.Posts.getParameters(terms);
        const posts = await context.BatchingPosts.find(selector);
        return posts.length
      } catch(error) {
        console.error('[Resolver error]', error);
        return -1;
      }
    },
  
  }
};

export default resolvers;
