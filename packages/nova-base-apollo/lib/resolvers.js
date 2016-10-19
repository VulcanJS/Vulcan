import Posts from 'meteor/nova:posts';
import Users from 'meteor/nova:users';
import Comments from 'meteor/nova:comments';
import Categories from 'meteor/nova:categories';

const resolvers = {
  Post: {
    user(post, args, context) {
      return Users.findOne({_id: post.userId});
    },
    commenters(post, args, context) {
      return post.commenters ? Users.find({_id: {$in: post.commenters}}).fetch() : [];
    },
    comments(post, args, context) {
      return post.commentCount ? Comments.find({postId: post._id}).fetch() : [];
    },
    upvoters(post, args, context) {
      return post.upvoters ? Users.find({_id: {$in: post.upvoters}}).fetch() : [];
    },
    downvoters(post, args, context) {
      return post.downvoters ? Users.find({_id: {$in: post.downvoters}}).fetch() : [];
    },
    categories(post, args, context) {
      return post.categories ? Categories.find({_id: {$in: post.categories}}).fetch() : [];
    },
  },
  User: {
    telescope(user, args, context) {
      return user.telescope;
    },
  },
  UserTelescope: {
    downvotedComments(telescope, args, context) {
      return telescope.downvotedComments ? telescope.downvotedComments : []
    },
    downvotedPosts(telescope, args, context) {
      return telescope.downvotedPosts ? telescope.downvotedPosts : []
    },
    upvotedComments(telescope, args, context) {
      return telescope.upvotedComments ? telescope.upvotedComments : []
    },
    upvotedPosts(telescope, args, context) {
      return telescope.upvotedPosts ? telescope.upvotedPosts : [];
    },
  },
  Comment: {
    parentComment(comment, args, context) {
      return comment.parentCommentId ? Comments.findOne({_id: comment.parentCommentId}) : null;
    },
    topLevelComment(comment, args, context) {
      return comment.topLevelCommentId ? Comments.findOne({_id: comment.topLevelCommentId}) : null;
    },
    post(comment, args, context) {
      return Posts.findOne({_id: comment.postId});
    },
    user(comment, args, context) {
      return Users.findOne({_id: comment.userId});
    },
    upvoters(comment, args, context) {
      return comment.upvoters ? Users.find({_id: {$in: comment.upvoters}}).fetch() : [];
    },
    downvoters(comment, args, context) {
      return comment.downvoters ? Users.find({_id: {$in: comment.downvoters}}).fetch() : [];
    },
  },
  Category: {
    parent(category, args, context) {
      return category.parent ? Categories.findOne({_id: category.parent }) : null;
    }
  },
  Query: {
    posts(root, args, context) {
      return Posts.find({}, {limit: 5}).fetch();
    },
    post(root, args, context) {
      return Posts.findOne({_id: args._id});
    },
    users(root, args, context) {
      return Users.find({}, {limit: 5}).fetch();
    },
    user(root, args, context) {
      return Users.findOne({_id: args._id});
    },
    comments(root, args, context) {
      return Comments.find({}, {limit: 5}).fetch();
    },
    comment(root, args, context) {
      return Comments.findOne({_id: args._id});
    },
    categories(root, args, context) {
      return Categories.find({}, {limit: 5}).fetch();
    },
    category(root, args, context) {
      return Categories.findOne({_id: args._id});
    },
  },
};

export default resolvers;