import { GraphQLSchema } from 'meteor/vulcan:core';

const specificResolvers = {
  Post: {
    async commenters(post, args, {currentUser, Users}) {
      if (!post.commenters) return [];
      const commenters = await Users.loader.loadMany(post.commenters);
      return Users.restrictViewableFields(currentUser, Users, commenters);
    },
  },
  Comment: {
    async parentComment(comment, args, {currentUser, Users, Comments}) {
      if (!comment.parentCommentId) return null;
      const parentComment = await Comments.loader.load(comment.parentCommentId);
      return Users.restrictViewableFields(currentUser, Comments, parentComment);
    },
    async topLevelComment(comment, args, {currentUser, Users, Comments}) {
      if (!comment.topLevelCommentId) return null;
      const topLevelComment = await Comments.loader.load(comment.topLevelCommentId);
      return Users.restrictViewableFields(currentUser, Comments, topLevelComment);
    },
    async post(comment, args, {currentUser, Users, Posts}) {
      if (!comment.postId) return null;
      const post = await Posts.loader.load(comment.postId);
      return Users.restrictViewableFields(currentUser, Posts, post);
    },
    async user(comment, args, {currentUser, Users}) {
      if (!comment.userId) return null;
      const user = await Users.loader.load(comment.userId);
      return Users.restrictViewableFields(currentUser, Users, user);
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

// root resolvers: basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'commentsList',

    resolver(root, {terms}, {currentUser, Users, Comments}) {

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Comments.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      const comments = Comments.find(selector, options).fetch();

      // restrict documents fields
      const restrictedComments = Users.restrictViewableFields(currentUser, Comments, comments);

      // prime the cache
      restrictedComments.forEach(comment => Comments.loader.prime(comment._id, comment));

      return restrictedComments;
    },

  },

  single: {
    
    name: 'commentsSingle',
    
    async resolver(root, {documentId}, {currentUser, Users, Comments}) {
      const comment = await Comments.loader.load(documentId);
      return Users.restrictViewableFields(currentUser, Comments, comment);
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
