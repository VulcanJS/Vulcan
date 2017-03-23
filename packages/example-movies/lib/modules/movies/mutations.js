/*

Define the three default mutations:

- new (e.g.: moviesNew(document: moviesInput) : Movie )
- edit (e.g.: moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie )
- remove (e.g.: moviesRemove(documentId: String) : Movie )

Each mutation has:

- A name
- A check function that takes the current user and (optionally) the document affected
- The actual mutation

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const mutations = {

  new: {
    
    name: 'moviesNew',
    
    check(user) {
      if (!user) return false;
      return Users.canDo(user, 'movies.new');
    },
    
    mutation(root, {document}, context) {
      
      Utils.performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Movies,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {
    
    name: 'moviesEdit',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'movies.edit.own') : Users.canDo(user, `movies.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Movies.findOne(documentId);
      Utils.performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Movies, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },
  
  remove: {

    name: 'moviesRemove',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'movies.remove.own') : Users.canDo(user, `movies.remove.all`);
    },
    
    mutation(root, {documentId}, context) {

      const document = context.Movies.findOne(documentId);
      Utils.performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Movies, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
