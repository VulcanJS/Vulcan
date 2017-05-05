/*

Three resolvers are defined:

- list (e.g.: commentsList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: commentsSingle(_id: String) )
- listTotal (e.g.: commentsTotal )

*/

import { addGraphQLResolvers } from 'meteor/vulcan:core';

// basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'commentsList',

    resolver(root, {terms = {}}, context, info) {
      let {selector, options} = context.Comments.getParameters(terms, {}, context.currentUser);
      return context.Comments.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'commentsSingle',

    resolver(root, {documentId}, context) {
      const document = context.Comments.findOne({_id: documentId});
      return context.Users.restrictViewableFields(context.currentUser, context.Comments, document);
    },
  
  },

  total: {
    
    name: 'commentsTotal',
    
    resolver(root, {terms = {}}, context) {
      const {selector, options} = context.Comments.getParameters(terms, {}, context.currentUser);
      return context.Comments.find(selector, options).count();
    },
  
  }
};

// add the "user" resolver for the Comment type separately
const commentUserResolver = {
  Comment: {
    user(movie, args, context) {
      return context.Users.findOne({ _id: movie.userId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) });
    },
  },
};
addGraphQLResolvers(commentUserResolver);

export default resolvers;