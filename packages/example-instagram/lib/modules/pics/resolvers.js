/*

Three resolvers are defined:

- list (e.g.: picsList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: picsSingle(_id: String) )
- listTotal (e.g.: picsTotal )

*/

import { addGraphQLResolvers } from 'meteor/vulcan:core';

// basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'picsList',

    resolver(root, {terms = {}}, context, info) {
      let {selector, options} = context.Pics.getParameters(terms, {}, context.currentUser);
      return context.Pics.find(selector, options).fetch();
    },

  },

  single: {
    
    name: 'picsSingle',

    resolver(root, {documentId}, context) {
      const document = context.Pics.findOne({_id: documentId});
      return context.Users.restrictViewableFields(context.currentUser, context.Pics, document);
    },
  
  },

  total: {
    
    name: 'picsTotal',
    
    resolver(root, {terms = {}}, context) {
      const {selector, options} = context.Pics.getParameters(terms, {}, context.currentUser);
      return context.Pics.find(selector, options).count();
    },
  
  }
};

// add the "user" resolver for the Pic type separately
const picUserResolver = {
  Pic: {
    user(pic, args, context) {
      return context.Users.findOne({ _id: pic.userId }, { fields: context.Users.getViewableFields(context.currentUser, context.Users) });
    },
    commentsCount(pic, args, context) {
      return context.Comments.find({picId: pic._id}).count();
    }
  },
};
addGraphQLResolvers(picUserResolver);

export default resolvers;