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

  mutation(root, { data }, context) {
    const { Users, currentUser } = context;
    performCheck(this, currentUser, data);

    return createMutator({
      collection: Users,
      data,
      currentUser,
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

  async mutation(root, { selector, data }, context) {
    const { Users, currentUser } = context;

    const document = await Connectors.get(Users, selector);
    performCheck(this, currentUser, document);

    return updateMutator({
      collection: Users,
      selector,
      data,
      currentUser,
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

  async mutation(root, { selector }, context) {

    const { Users, currentUser } = context;

    const document = await Connectors.get(Users, selector);
    performCheck(this, currentUser, document);

    return deleteMutator({
      collection: Users,
      selector,
      currentUser,
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
