import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const options = {
  editCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'sequences.edit.own') : Users.canDo(user, `sequences.edit.all`)
  },

  removeCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'sequences.edit.own') : Users.canDo(user, `sequences.edit.all`)
  },
}

const Sequences = createCollection({

  collectionName: 'Sequences',

  typeName: 'Sequence',

  schema,

  resolvers: getDefaultResolvers('Sequences'),

  mutations: getDefaultMutations('Sequences', options)
})

export default Sequences;
