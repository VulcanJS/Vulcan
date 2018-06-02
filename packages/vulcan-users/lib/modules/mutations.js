import { createMutator, updateMutator, deleteMutator, Utils, Connectors } from 'meteor/vulcan:lib';
import Users from './collection'; // TODO: circular dependency?

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
};

const mutations = {

  create: {
    
    name: 'createUser',
    
    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'users.new');
    },
    
    mutation(root, {document}, context) {
      
      performCheck(this, context.currentUser, document);

      return createMutator({
        collection: context.Users,
        document: document, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  update: {
    
    name: 'updateUser',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'users.edit.own') : Users.canDo(user, `users.edit.all`);
    },

    async mutation(root, {documentId, set, unset}, context) {

      const document = await Connectors.get(context.Users, documentId);
      performCheck(this, context.currentUser, document);

      return updateMutator({
        collection: context.Users, 
        documentId: documentId, 
        set: set, 
        unset: unset, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },
  
  delete: {

    name: 'deleteUser',
    
    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'users.remove.own') : Users.canDo(user, `users.remove.all`);
    },
    
    async mutation(root, {documentId}, context) {

      const document = await Connectors.get(context.Users, documentId);
      performCheck(this, context.currentUser, document);

      return deleteMutator({
        collection: context.Users, 
        documentId: documentId, 
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
