/*

Three resolvers are defined:

- list (e.g.: moviesList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: moviesSingle(_id: String) )
- listTotal (e.g.: moviesTotal )

*/

import { addGraphQLResolvers } from 'meteor/vulcan:core';

// basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'moviesList',

    resolver(root, {terms = {}}, context, info) {
      let {selector, options} = context.Movies.getParameters(terms, {}, context.currentUser);
      return context.Movies.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'moviesSingle',

    resolver(root, {documentId}, context) {
      const document = context.Movies.findOne({_id: documentId});
      return context.Users.restrictViewableFields(context.currentUser, context.Movies, document);
    },
  
  },

  total: {
    
    name: 'moviesTotal',
    
    resolver(root, {terms = {}}, context) {
      const {selector, options} = context.Movies.getParameters(terms, {}, context.currentUser);
      return context.Movies.find(selector, options).count();
    },
  
  }
};

// add the "user" resolver for the Movie type separately
const movieUserResolver = {
  Movie: {
    user(movie, args, context) {
      return context.Users.findOne({ _id: movie.userId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) });
    },
  },
};
addGraphQLResolvers(movieUserResolver);

export default resolvers;