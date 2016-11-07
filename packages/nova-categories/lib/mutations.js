import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Categories from './collection.js'

Categories.mutations = {

  categoriesNew(root, {document}, context) {
    return newMutation({
      collection: context.Categories, 
      document: document,
      currentUser: context.currentUser,
      validate: true
    });
  },

  categoriesEdit(root, {documentId, set, unset}, context) {
    return editMutation({
      collection: context.Categories, 
      documentId: documentId,
      set: set, 
      unset: unset, 
      currentUser: context.currentUser, 
      validate: true
    });
  },

  categoriesRemove(root, {documentId}, context) {
    return removeMutation({
      collection: context.Categories, 
      documentId: documentId, 
      currentUser: context.currentUser,
      validate: true
    });
  },

};

// GraphQL mutations
Telescope.graphQL.addMutation('categoriesNew(document: categoriesInput) : Category');
Telescope.graphQL.addMutation('categoriesEdit(documentId: String, set: categoriesInput, unset: categoriesUnset) : Category');
Telescope.graphQL.addMutation('categoriesRemove(documentId: String) : Category');

export default Categories.mutations;