import Telescope from 'meteor/nova:lib';

const movieResolver = {
  Movie: {
    user(movie, args, context) {
      return context.Users.findOne({ _id: movie.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
};
Telescope.graphQL.addResolvers(movieResolver);

const resolvers = {
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
};

export default resolvers;