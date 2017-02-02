import { newMutation, editMutation, removeMutation, GraphQLSchema, Utils } from 'meteor/nova:core';
import Users from 'meteor/nova:users';

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
};

const mutations = {

  new: {
    
    name: 'postsNew',
    
    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'posts.new');
    },
    
    mutation(root, {document}, context) {
      
      performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Posts,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {
    
    name: 'postsEdit',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'posts.edit.own') : Users.canDo(user, `posts.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Posts.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Posts, 
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

    name: 'postsRemove',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'posts.remove.own') : Users.canDo(user, `posts.remove.all`);
    },
    
    mutation(root, {documentId}, context) {

      const document = context.Posts.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Posts, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

GraphQLSchema.addMutation('increasePostViewCount(postId: String): Float');

export default mutations;
