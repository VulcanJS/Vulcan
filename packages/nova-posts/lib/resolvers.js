import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

const resolvers = {
  Post: {
    user(post, args, context) {
      return context.Users.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, Users) });
    },
    upvoters(post, args, context) {
      return post.upvoters ? context.Users.find({_id: {$in: post.upvoters}}, { fields: context.getViewableFields(context.currentUser, Users) }).fetch() : [];
    },
    downvoters(post, args, context) {
      return post.downvoters ? context.Users.find({_id: {$in: post.downvoters}}, { fields: context.getViewableFields(context.currentUser, Users) }).fetch() : [];
    },
  },
  Query: {
    posts(root, {terms, offset, limit}, context, info) {
      // console.log("// context")
      // console.log(context)
      let {selector, options} = context.Posts.parameters.get(terms);
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      options.limit = protectedLimit;
      options.skip = offset;
      // keep only fields that should be viewable by current user
      options.fields = context.getViewableFields(context.currentUser, Posts);
      return context.Posts.find(selector, options).fetch();
    },
    postsViewTotal(root, {terms}, context) {
      const {selector} = context.Posts.parameters.get(terms);
      return context.Posts.find(selector).count();
    },
    post(root, args, context) {
      Meteor._sleepForMs(2000); // wait 2 seconds
      return context.Posts.findOne({_id: args._id}, { fields: context.getViewableFields(context.currentUser, Posts) });
    },
  },
  Mutation: mutations
  // Mutation: {
  //   postVote(root, {postId, voteType}, context) {
  //     Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
  //     console.log("sleep done");
  //     const post = Posts.findOne(postId);
  //     return context.Users.canDo(context.currentUser, `posts.${voteType}`) ? Telescope.operateOnItem(context.Posts, post, context.currentUser, voteType) : false;
  //   },
  // }
};

Telescope.graphQL.addResolvers(resolvers);