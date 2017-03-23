/*

Three resolvers are defined:

- list (e.g.: moviesList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: moviesSingle(_id: String) )
- listTotal (e.g.: moviesTotal )

*/

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

    resolver(root, {terms = {}}, context, info) {
      let {selector, options} = context.Movies.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.fields = context.getViewableFields(context.currentUser, context.Movies);
      return context.Movies.find(selector, options).fetch();
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
    
    resolver(root, {terms = {}}, context) {
      let {selector, options} = context.Movies.getParameters(terms);
      return context.Movies.find(selector, options).count();
    },
  
  }
};

export default resolvers;