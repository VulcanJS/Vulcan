import { createCollection, getDefaultResolvers, getDefaultMutations, newMutation } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import './fragments.js'
import './permissions.js'

const options = {
  checkEdit: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'sequence.edit.own') : Users.canDo(user, `sequence.edit.all`)
  },

  checkRemove: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'sequence.edit.own') : Users.canDo(user, `sequence.edit.all`)
  },
}

/*
  The sequenceNew mutation is altered to include the addition of a null Chapter.
*/

let mutations = getDefaultMutations('Sequences', options)

mutations.new = {

  name: 'sequencesNew',

  check(user, document) {
    if (!user) return false;
    return Users.canDo(user, 'posts.new');
  },

  mutation(root, {document}, context) {

    performCheck(this.check, context.currentUser, document);

    let chapterData = {
      number: 0,
    }

    let chapter = newMutation({
      collecton: context.Chapters,
      document: chapterData,
      curentUser: context.currentUser,
      validate: true,
      context,
    })

    document.chapterIds = [chapter._id]

    return newMutation({
      collection: context.Posts,
      document: document,
      currentUser: context.currentUser,
      validate: true,
      context,
    });
  },

}

const Sequences = createCollection({

  collectionName: 'Sequences',

  typeName: 'Sequence',

  schema,

  resolvers: getDefaultResolvers('Sequences'),

  mutations,
})

export default Sequences;
