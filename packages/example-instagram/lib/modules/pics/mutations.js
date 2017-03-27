/*

Define the three default mutations:

- new (e.g.: picsNew(document: picsInput) : Movie )
- edit (e.g.: picsEdit(documentId: String, set: picsInput, unset: picsUnset) : Movie )
- remove (e.g.: picsRemove(documentId: String) : Movie )

Each mutation has:

- A name
- A check function that takes the current user and (optionally) the document affected
- The actual mutation

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const mutations = {

  new: {
    
    name: 'picsNew',
    
    check(user) {
      if (!user) return false;
      return Users.canDo(user, 'pics.new');
    },
    
    mutation(root, {document}, context) {
      
      Utils.performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Pics,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {
    
    name: 'picsEdit',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'pics.edit.own') : Users.canDo(user, `pics.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Pics.findOne(documentId);
      Utils.performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Pics, 
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

    name: 'picsRemove',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'pics.remove.own') : Users.canDo(user, `pics.remove.all`);
    },
    
    mutation(root, {documentId}, context) {

      const document = context.Pics.findOne(documentId);
      Utils.performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Pics, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
