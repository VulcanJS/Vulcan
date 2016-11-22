import Telescope from 'meteor/nova:lib';

// add the "user" resolver for the Movie type separately
const movieResolver = {
  Movie: {
    user(movie, args, context) {
      return context.Users.findOne({ _id: movie.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
};
Telescope.graphQL.addResolvers(movieResolver);

// basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'moviesList',

    resolver(root, {offset, limit}, context, info) {
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      let options = {};
      options.limit = protectedLimit;
      options.skip = offset;
      // keep only fields that should be viewable by current user
      options.fields = context.getViewableFields(context.currentUser, context.Movies);
      return context.Movies.find({}, options).fetch();
    },

  },

  single: {
    
    name: 'moviesSingle',
    
    resolver(root, args, context) {
      return context.Movies.findOne({_id: args._id}, { fields: context.getViewableFields(context.currentUser, context.Movies) });
    },
  
  },

  total: {
    
    name: 'moviesTotal',
    
    resolver(root, args, context) {
      return context.Movies.find().count();
    },
  
  }
};

export default resolvers;