import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Users from './collection.js'

// Resolvers
Users.mutations = {

  usersNew(root, {document}, context) {
    return newMutation({
      collection: context.Users, 
      document: document, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  usersEdit(root, {documentId, set, unset}, context) {
    return editMutation({
      collection: context.Users, 
      documentId: documentId, 
      set: set, 
      unset: unset, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  usersRemove(root, {documentId}, context) {
    return removeMutation({
      collection: context.Users, 
      documentId: documentId, 
      currentUser: context.currentUser,
      validate: true
    });
  },

};

// GraphQL mutations
Telescope.graphQL.addMutation('usersNew(document: usersInput) : User');
Telescope.graphQL.addMutation('usersEdit(documentId: String, set: usersInput, unset: usersUnset) : User');
Telescope.graphQL.addMutation('usersRemove(documentId: String) : User');

export default Users.mutations;