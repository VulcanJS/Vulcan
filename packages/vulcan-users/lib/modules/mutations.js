import { createMutator, updateMutator, deleteMutator, Utils, Connectors } from 'meteor/vulcan:lib';
import Users from './collection'; // TODO: circular dependency?

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document))
    throw new Error(
      Utils.encodeIntlError({ id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"` })
    );
};

const createMutation = {
  name: 'createUser',

  check(user, document) {
    if (!user) return false;
    // OpenCRUD backwards compatibility
    return Users.canDo(user, ['users.create', 'users.new']);
  },

  mutation(root, { document }, context) {
    performCheck(this, context.currentUser, document);

    return createMutator({
      collection: context.Users,
      document: document,
      currentUser: context.currentUser,
      validate: true,
      context,
    });
  },
};

const updateMutation = {
  name: 'updateUser',

  check(user, document) {
    if (!user || !document) return false;
    // OpenCRUD backwards compatibility
    return Users.owns(user, document) ? Users.canDo(user, ['users.update.own', 'users.edit.own']) : Users.canDo(user, [`users.update.all`, `users.edit.all`]);
  },

  async mutation(root, { documentId, set, unset }, context) {
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
};

const deleteMutation = {
  name: 'deleteUser',

  check(user, document) {
    if (!user || !document) return false;
    // OpenCRUD backwards compatibility
    return Users.owns(user, document) ? Users.canDo(user, ['users.delete.own', 'users.remove.own']) : Users.canDo(user, [`users.delete.all`, `users.remove.all`]);
  },

  async mutation(root, { documentId }, context) {
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
};
const mutations = {
  create: createMutation,
  update: updateMutation,
  delete: deleteMutation,

  // OpenCRUD backwards compatibility

  new: createMutation,
  edit: updateMutation,
  remove: deleteMutation,
};

export default mutations;
