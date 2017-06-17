/*

Define the three default mutations:

- new (e.g.: moviesNew(document: moviesInput) : Movie )
- edit (e.g.: moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie )
- remove (e.g.: moviesRemove(documentId: String) : Movie )

Each mutation has:

- A name
- A check function that takes the current user and (optionally) the document affected
- The actual mutation

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const performCheck = (mutation, user, document) => {
  if(!Meteor.isDevelopment){
    if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
  }
}

const mutations = {

  new: {

    name: 'notificationsNew',

    check(user) {
      if (!user) return false;
      return Users.canDo(user, 'notifications.new');
    },

    mutation(root, {document}, context) {

      performCheck(this.check, context.currentUser, document);

      return newMutation({
        collection: context.Notifications,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'notificationsEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'notifications.edit.own') : Users.canDo(user, `notifications.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Notifications.findOne(documentId);
      performCheck(this.check.check, context.currentUser, document);

      return editMutation({
        collection: context.Notifications,
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

    name: 'notificationsRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'notifications.remove.own') : Users.canDo(user, `notifications.remove.all`);
    },

    mutation(root, {documentId}, context) {

      const document = context.Notifications.findOne(documentId);

      performCheck(this.check, context.currentUser, document);

      return removeMutation({
        collection: context.Notifications,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
