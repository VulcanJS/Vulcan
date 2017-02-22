import { GraphQLSchema } from 'meteor/nova:core';

const specificResolvers = {
  Post: {
    async commenters(post, args, context) {
      if (post.commenters) {
        const commenters = await context.BatchingUsers.find({_id: {$in: post.commenters}}, { fields: context.getViewableFields(context.currentUser, context.Users) });
        
        return commenters;
      }
      
      return [];
    },
    // comments(post, args, context) {
    //   return post.commentCount ? context.Comments.find({postId: post._id}, { fields: context.getViewableFields(context.currentUser, context.Comments) }).fetch() : [];
    // },
  },
  Comment: {
    async parentComment(comment, args, context) {
      if (comment.parentCommentId) {
        const comment = await context.BatchingComments.findOne({_id: comment.parentCommentId}, { fields: context.getViewableFields(context.currentUser, context.Comments) });
      }
      return null;
    },
    async topLevelComment(comment, args, context) {
      if (comment.topLevelCommentId) {
        const comment = await context.BatchingComments.findOne({_id: comment.topLevelCommentId}, { fields: context.getViewableFields(context.currentUser, context.Comments) });
      }
      return null;
    },
    async post(comment, args, context) {
      const post = await context.BatchingPosts.findOne({_id: comment.postId}, { fields: context.getViewableFields(context.currentUser, context.Posts) });
      return post;
    },
    async user(comment, args, context) {
      const user = await context.BatchingUsers.findOne({_id: comment.userId}, { fields: context.getViewableFields(context.currentUser, context.Users) });
      return user;
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'commentsList',

    async resolver(root, {terms}, context) {
      let {selector, options} = context.Comments.getParameters(terms);

      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Comments);

      const comments = await context.BatchingComments.find(selector, options);
      
      return comments;
    },

  },

  single: {
    
    name: 'commentsSingle',
    
    async resolver(root, {documentId}, context) {
      const comment = await context.BatchingComments.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Comments) });
      
      return comment;
    },
  
  },

  total: {
    
    name: 'commentsTotal',
    // broken because it doesn't take any arguments in the query
    async resolver(root, {terms}, context) {
      const comments = await context.BatchingComments.find({postId: terms.postId});
      
      return comments.length;
    },
  
  }
};

export default resolvers;
