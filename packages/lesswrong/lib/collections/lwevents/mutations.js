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

const mutations = {

  new: {

    name: 'LWEventsNew',

    check(user, document) {
      return user && (Users.canDo(user, 'events.new') || Users.canDo(user, 'events.new.own') && document.userId === user._id);
    },

    mutation(root, {document}, context) {

      Utils.performCheck(this.check, context.currentUser, document);

      return newMutation({
        collection: context.LWEvents,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'LWEventsEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'events.edit.own') : Users.canDo(user, `events.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.LWEvents.findOne(documentId);
      Utils.performCheck(this.check, context.currentUser, document);

      return editMutation({
        collection: context.LWEvents,
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

    name: 'LWEventsRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'events.remove.own') : Users.canDo(user, `events.remove.all`);
    },

    mutation(root, {documentId}, context) {

      const document = context.LWEvents.findOne(documentId);

      Utils.performCheck(this.check, context.currentUser, document);

      return removeMutation({
        collection: context.LWEvents,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
