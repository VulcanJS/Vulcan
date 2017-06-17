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

import { newMutation, editMutation, removeMutation, GraphQLSchema, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const performCheck = (mutation, user, document) => {
  if(!Meteor.isDevelopment){
    if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
  }
}

const mutations = {

  new: {

    name: 'messagesNew',

    check(user, document) {
      if (!user) return false;
      return (Users.canDo(user, 'messages.new') && user.userId == document.userId && Conversations.findOne(document.conversationId).participants.includes(user.userId));
    },

    mutation(root, {document}, context) {

      performCheck(this.check, context.currentUser, document);

      return newMutation({
        collection: context.Messages,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'messagesEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'messages.edit.own') : Users.canDo(user, `messages.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Messages.findOne(documentId);
      performCheck(this.check, context.currentUser, document);

      return editMutation({
        collection: context.Messages,
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

    name: 'messagesRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'messages.remove.own') : Users.canDo(user, `messages.remove.all`);
    },

    mutation(root, {documentId}, context) {

      const document = context.Messages.findOne(documentId);

      performCheck(this.check, context.currentUser, document);

      return removeMutation({
        collection: context.Messages,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};


export default mutations;
