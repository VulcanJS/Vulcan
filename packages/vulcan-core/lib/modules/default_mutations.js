/*

Default mutations

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:lib';
import Users from 'meteor/vulcan:users';

export const getDefaultMutations = (collectionName, options = {}) => ({

  // mutation for inserting a new document

  new: {
    
    name: `${collectionName}New`,
    
    // check function called on a user to see if they can perform the operation
    check(user, document) {
      if (options.newCheck) {
        return options.newCheck(user, document);
      }
      // if user is not logged in, disallow operation
      if (!user) return false;
      // else, check if they can perform "foo.new" operation (e.g. "movies.new")
      return Users.canDo(user, `${collectionName.toLowerCase()}.new`);
    },
    
    async mutation(root, {document}, context) {
      
      const collection = context[collectionName];

      // check if current user can pass check function; else throw error
      Utils.performCheck(this.check, context.currentUser, document);

      // pass document to boilerplate newMutation function
      return await newMutation({
        collection,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  // mutation for editing a specific document

  edit: {
    
    name: `${collectionName}Edit`,
    
    // check function called on a user and document to see if they can perform the operation
    check(user, document) {
      if (options.editCheck) {
        return options.editCheck(user, document);
      }

      if (!user || !document) return false;
      // check if user owns the document being edited. 
      // if they do, check if they can perform "foo.edit.own" action
      // if they don't, check if they can perform "foo.edit.all" action
      return Users.owns(user, document) ? Users.canDo(user, `${collectionName.toLowerCase()}.edit.own`) : Users.canDo(user, `${collectionName.toLowerCase()}.edit.all`);
    },

    async mutation(root, {documentId, set, unset}, context) {

      const collection = context[collectionName];

      // get entire unmodified document from database
      const document = collection.findOne(documentId);

      // check if user can perform operation; if not throw error
      Utils.performCheck(this.check, context.currentUser, document);

      // call editMutation boilerplate function
      return await editMutation({
        collection, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },
  
  // mutation for removing a specific document (same checks as edit mutation)

  remove: {

    name: `${collectionName}Remove`,
    
    check(user, document) {
      if (options.removeCheck) {
        return options.removeCheck(user, document);
      }
      
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, `${collectionName.toLowerCase()}.remove.own`) : Users.canDo(user, `${collectionName.toLowerCase()}.remove.all`);
    },
    
    async mutation(root, {documentId}, context) {

      const collection = context[collectionName];

      const document = collection.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document, context);

      return await removeMutation({
        collection, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

});
