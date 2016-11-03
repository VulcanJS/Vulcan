// not used anymore

import Posts from 'meteor/nova:posts';
import Users from 'meteor/nova:users';
import Comments from 'meteor/nova:comments';
import Categories from 'meteor/nova:categories';

// shortcut
const gVF = Users.getViewableFields;

const resolvers = {
  Post: {
    user(post, args, context) {
      return Users.findOne({ _id: post.userId }, { fields: gVF(context.currentUser, Users) });
    },
    commenters(post, args, context) {
      return post.commenters ? Users.find({_id: {$in: post.commenters}}, { fields: gVF(context.currentUser, Users) }).fetch() : [];
    },
    comments(post, args, context) {
      return post.commentCount ? Comments.find({postId: post._id}, { fields: gVF(context.currentUser, Comments) }).fetch() : [];
    },
    upvoters(post, args, context) {
      return post.upvoters ? Users.find({_id: {$in: post.upvoters}}, { fields: gVF(context.currentUser, Users) }).fetch() : [];
    },
    downvoters(post, args, context) {
      return post.downvoters ? Users.find({_id: {$in: post.downvoters}}, { fields: gVF(context.currentUser, Users) }).fetch() : [];
    },
    categories(post, args, context) {
      return post.categories ? Categories.find({_id: {$in: post.categories}}, { fields: gVF(context.currentUser, Categories) }).fetch() : [];
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
      return comment.parentCommentId ? Comments.findOne({_id: comment.parentCommentId}, { fields: gVF(context.currentUser, Comments) }) : null;
    },
    topLevelComment(comment, args, context) {
      return comment.topLevelCommentId ? Comments.findOne({_id: comment.topLevelCommentId}, { fields: gVF(context.currentUser, Comments) }) : null;
    },
    post(comment, args, context) {
      return Posts.findOne({_id: comment.postId}, { fields: gVF(context.currentUser, Posts) });
    },
    user(comment, args, context) {
      return Users.findOne({_id: comment.userId}, { fields: gVF(context.currentUser, Posts) });
    },
    upvoters(comment, args, context) {
      return comment.upvoters ? Users.find({_id: {$in: comment.upvoters}}, { fields: gVF(context.currentUser, Users) }).fetch() : [];
    },
    downvoters(comment, args, context) {
      return comment.downvoters ? Users.find({_id: {$in: comment.downvoters}}, { fields: gVF(context.currentUser, Users) }).fetch() : [];
    },
  },
  Category: {
    parent(category, args, context) {
      return category.parent ? Categories.findOne({_id: category.parent }, { fields: gVF(context.currentUser, Categories) }) : null;
    }
  },
  Query: {
    posts(root, {terms, offset, limit}, context, info) {
      let {selector, options} = Posts.parameters.get(terms);
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      options.limit = protectedLimit;
      options.skip = offset;
      // keep only fields that should be viewable by current user
      options.fields = gVF(context.currentUser, Posts);
      return Posts.find(selector, options).fetch();
    },
    postsViewTotal(root, {terms}, context) {
      const {selector} = Posts.parameters.get(terms);
      return Posts.find(selector).count();
    },
    post(root, args, context) {
      Meteor._sleepForMs(2000); // wait 2 seconds
      return Posts.findOne({_id: args._id}, { fields: gVF(context.currentUser, Posts) });
    },
    users(root, args, context) {
      const options = {
        limit: 5,
        fields: gVF(context.currentUser, Users)
      }
      return Users.find({}, {limit: 5}).fetch();
    },
    user(root, args, context) {
      return Users.findOne({$or: [{_id: args._id}, {'telescope.slug': args.slug}]}, { fields: gVF(context.currentUser, Users) });
    },
    currentUser(root, args, context) {
      return context && context.userId ? Meteor.users.findOne(context.userId) : null;
    },
    comments(root, args, context) {
      const options = {
        limit: 5,
        fields: gVF(context.currentUser, Comments)
      }
      return Comments.find({}, options).fetch();
    },
    comment(root, args, context) {
      return Comments.findOne({_id: args._id}, { fields: gVF(context.currentUser, Comments) });
    },
    categories(root, args, context) {
      const options = {
        limit: 5,
        fields: gVF(context.currentUser, Categories)
      };
      return Categories.find({}, options).fetch();
    },
    category(root, args, context) {
      return Categories.findOne({_id: args._id}, { fields: gVF(context.currentUser, Categories) });
    },
  },
  Mutation: {
    postVote(root, {postId, voteType}, context) {
      Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
      console.log("sleep done");
      const post = Posts.findOne(postId);
      return Users.canDo(context.currentUser, `posts.${voteType}`) ? Telescope.operateOnItem(Posts, post, context.currentUser, voteType) : false;
    },
  }
};

export default resolvers;