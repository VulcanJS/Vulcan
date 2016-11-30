/*

Three resolvers are defined:

- list (e.g.: moviesList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: moviesSingle(_id: String) )
- listTotal (e.g.: moviesTotal )

*/

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

    resolver(root, {terms, offset, limit}, context, info) {
      const options = {
        sort: {createdAt: -1},
        // protected limit
        limit: (limit < 1 || limit > 10) ? 10 : limit,
        skip: offset,
        // keep only fields that should be viewable by current user
        fields: context.getViewableFields(context.currentUser, context.Movies),
      };
      return context.Movies.find({}, options).fetch();
    },

  },

  single: {
    
    name: 'moviesSingle',
    
    resolver(root, {documentId}, context) {
      return context.Movies.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Movies) });
    },
  
  },

  total: {
    
    name: 'moviesTotal',
    
    resolver(root, {terms}, context) {
      return context.Movies.find().count();
    },
  
  }
};

export default resolvers;