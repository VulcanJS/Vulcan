// At present, every sequence starts with an empty chapter that does not show
// on the sequence page.

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import Users from 'meteor/vulcan:users'

const options = {
  checkNew: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'chapter.new.own') : Users.canDo(user, `chapter.new.all`)
  },

  checkEdit: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'chapter.edit.own') : Users.canDo(user, `chapter.edit.all`)
  },

  checkRemove: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'chapter.remove.own') : Users.canDo(user, `chapter.remove.all`)
  },
}

const Chapters = createCollection({

  collectionName: 'Chapters',

  typeName: 'Chapter',

  schema,

  resolvers: getDefaultResolvers('Chapters'),

  mutations: getDefaultMutations('Chapters', options),
})

export default Chapters;
