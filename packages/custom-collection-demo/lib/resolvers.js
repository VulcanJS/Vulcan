import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

const resolvers = {
  // Movie: {
  //   user(post, args, context) {
  //     return context.Users.findOne({ _id: post.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
  //   },
  // },
  Query: {
    moviesList(root, {offset, limit}, context, info) {
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      let options = {};
      options.limit = protectedLimit;
      options.skip = offset;
      // keep only fields that should be viewable by current user
      options.fields = context.getViewableFields(context.currentUser, context.Movies);
      return context.Movies.find({}, options).fetch();
    },
    moviesTotal(root, args, context) {
      return context.Movies.find().count();
    },
    moviesSingle(root, args, context) {
      return context.Movies.findOne({_id: args._id}, { fields: context.getViewableFields(context.currentUser, context.Movies) });
    },
  },
  Mutation: mutations
};

// add resolvers
Telescope.graphQL.addResolvers(resolvers);

// define GraphQL queries
Telescope.graphQL.addQuery(`
  moviesList(offset: Int, limit: Int): [Movie]
  moviesTotal: Int 
  moviesSingle(_id: String): Movie
`);

export default resolvers;