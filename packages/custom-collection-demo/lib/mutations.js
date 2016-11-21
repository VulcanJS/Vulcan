import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';

const mutations = {

  moviesNew(root, {document}, context) {
    return newMutation({
      action: 'movies.new',
      collection: context.Movies,
      document: document, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  moviesEdit(root, {documentId, set, unset}, context) {

    const document = context.Movies.findOne(documentId);
    const action = Users.owns(context.currentUser, document) ? 'posts.edit.own' : 'posts.edit.all';

    return editMutation({
      action: action,
      collection: context.Movies, 
      documentId: documentId, 
      set: set, 
      unset: unset, 
      currentUser: context.currentUser,
      validate: true
    });
  },

  moviesRemove(root, {documentId}, context) {

    const document = context.Movies.findOne(documentId);
    const action = Users.owns(context.currentUser, document) ? 'movies.remove.own' : 'movies.remove.all';

    return removeMutation({
      action: action,
      collection: context.Movies, 
      documentId: documentId, 
      currentUser: context.currentUser,
      validate: true
    });
  },

};

export default mutations;
