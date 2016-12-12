/*

Three resolvers are defined:

- list (e.g.: moviesList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: moviesSingle(_id: String) )
- listTotal (e.g.: moviesTotal )

*/

import Telescope from 'meteor/nova:lib';
import { GraphQLSchema } from 'meteor/nova:core';

// add the "user" resolver for the Movie type separately
const movieResolver = {
  Movie: {
    user(movie, args, context) {
      return context.Users.findOne({ _id: movie.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
};
GraphQLSchema.addResolvers(movieResolver);

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
      const document = context.Movies.findOne({_id: documentId});
      return _.pick(document, _.keys(context.getViewableFields(context.currentUser, context.Movies, document)));
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