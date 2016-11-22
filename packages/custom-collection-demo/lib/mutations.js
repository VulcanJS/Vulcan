import Telescope, { newMutation, editMutation, removeMutation } from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document)) throw new Error(`Sorry, you don't have the rights to perform the mutation ${mutation.name} on document _id = ${document._id}`);
}

const mutations = {

  new: {
    
    name: 'moviesNew',
    
    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'movies.new');
    },
    
    mutation(root, {document}, context) {
      
      performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Movies,
        document: document, 
        currentUser: context.currentUser,
        validate: true
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
      performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Movies, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true
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
      performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Movies, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true
      });
    },

  },

};

export default mutations;
