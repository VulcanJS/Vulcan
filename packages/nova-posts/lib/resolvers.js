import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

export default resolvers = {
  Post: {
    user(post, args, context) {
      return context.Users.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
    upvoters(post, args, context) {
      return post.upvoters ? context.Users.find({_id: {$in: post.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
    downvoters(post, args, context) {
      return post.downvoters ? context.Users.find({_id: {$in: post.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
  },
  Query: {
    postsList(root, {terms, offset, limit}, context, info) {
      // console.log("// context")
      // console.log(context)
      let {selector, options} = context.Posts.parameters.get(terms);
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      options.limit = protectedLimit;
      options.skip = offset;
      // keep only fields that should be viewable by current user
      options.fields = context.getViewableFields(context.currentUser, context.Posts);
      return context.Posts.find(selector, options).fetch();
    },
    postsListTotal(root, {terms}, context) {
      const {selector} = context.Posts.parameters.get(terms);
      return context.Posts.find(selector).count();
    },
    post(root, args, context) {
      // Meteor._sleepForMs(10000); // wait 2 seconds
      return context.Posts.findOne({_id: args._id}, { fields: context.getViewableFields(context.currentUser, context.Posts) });
    },
  },
  Mutation: mutations
};

Telescope.graphQL.addResolvers(resolvers);

Telescope.graphQL.addQuery(`
  postsList(terms: Terms, offset: Int, limit: Int): [Post]
  postsListTotal(terms: Terms): Int 
  post(_id: String): Post
`);