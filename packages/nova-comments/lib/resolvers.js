import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

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
    upvoters(comment, args, context) {
      return comment.upvoters ? context.Users.find({_id: {$in: comment.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
    downvoters(comment, args, context) {
      return comment.downvoters ? context.Users.find({_id: {$in: comment.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
  },
};

Telescope.graphQL.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'commentsList',

    resolver(root, {terms, offset, limit}, context) {
      const options = {
        limit: (limit < 1 || limit > 10) ? 10 : limit,
        skip: offset,
        fields: context.getViewableFields(context.currentUser, context.Comments)
      };

      return context.Comments.find({postId: terms.postId}, options).fetch();
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
    
    resolver(root, {postId}, context) {
      return context.Comments.find({postId}).count();
    },
  
  }
};

export default resolvers;