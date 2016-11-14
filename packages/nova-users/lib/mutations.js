import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Users from './collection.js'

// Resolvers
Users.mutations = {

  usersNew(root, {document}, context) {
    return newMutation({
      action: 'users.new',
      collection: context.Users, 
      document: document, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  usersEdit(root, {documentId, set, unset}, context) {

    const action = documentId === context.userId ? 'users.edit.own' : 'users.edit.all';

    return editMutation({
      action: action,
      collection: context.Users, 
      documentId: documentId, 
      set: set, 
      unset: unset, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  usersRemove(root, {documentId}, context) {

    const action = documentId === context.userId ? 'users.remove.own' : 'users.remove.all';

    return removeMutation({
      action: action,
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