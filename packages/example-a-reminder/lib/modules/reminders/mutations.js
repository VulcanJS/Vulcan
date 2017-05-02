/*

Define the three default mutations:

- new (e.g.: remindersNew(document: remindersInput) : Reminder )
- edit (e.g.: remindersEdit(documentId: String, set: remindersInput, unset: remindersUnset) : Reminder )
- remove (e.g.: remindersRemove(documentId: String) : Reminder )

Each mutation has:

- A name
- A check function that takes the current user and (optionally) the document affected
- The actual mutation

*/

import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
}

const mutations = {

  new: {

    name: 'remindersNew',

    check(user) {
      if (!user) return false;
      return Users.canDo(user, 'reminders.new');
    },

    mutation(root, {document}, context) {

      performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Reminders,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'remindersEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'reminders.edit.own') : Users.canDo(user, `reminders.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Reminders.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Reminders,
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

    name: 'remindersRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'reminders.remove.own') : Users.canDo(user, `reminders.remove.all`);
    },

    mutation(root, {documentId}, context) {

      const document = context.Reminders.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Reminders,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
