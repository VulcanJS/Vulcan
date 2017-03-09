import { GraphQLSchema } from 'meteor/nova:core';

const specificResolvers = {
  Post: {
    commenters(post, args, context) {
      return post.commenters ? context.Users.find({_id: {$in: post.commenters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
    // comments(post, args, context) {
    //   return post.commentCount ? context.Comments.find({postId: post._id}, { fields: context.getViewableFields(context.currentUser, context.Comments) }).fetch() : [];
    // },
  },
  Comment: {
    parentComment(comment, args, context) {
      return comment.parentCommentId ? context.Comments.findOne({_id: comment.parentCommentId}, { fields: context.getViewableFields(context.currentUser, context.Comments) }) : null;
    },
    topLevelComment(comment, args, context) {
      return comment.topLevelCommentId ? context.Comments.findOne({_id: comment.topLevelCommentId}, { fields: context.getViewableFields(context.currentUser, context.Comments) }) : null;
    },
    post(comment, args, context) {
      return context.Posts.findOne({_id: comment.postId}, { fields: context.getViewableFields(context.currentUser, context.Posts) });
    },
    user(comment, args, context) {
      return context.Users.findOne({_id: comment.userId}, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'commentsList',

    resolver(root, {terms}, context) {
      let {selector, options} = context.Comments.getParameters(terms);

      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Comments);

      return context.Comments.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'commentsSingle',
    
    resolver(root, {documentId}, context) {
      return context.Comments.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Comments) });
    },
  
  },

  total: {
    
    name: 'commentsTotal',
    // broken because it doesn't take any arguments in the query
    resolver(root, {terms}, context) {
      return context.Comments.find({postId: terms.postId}).count();
    },
  
  }
};

export default resolvers;
