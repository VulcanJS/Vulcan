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

const performCheck = (check, user, document) => {
  if(!Meteor.isDevelopment){
    if (!check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
  }
}

const mutations = {

  new: {

    name: 'conversationsNew',

    check(user) {
      if (!user) return false;
      return Users.canDo(user, 'conversations.new');
    },

    mutation(root, {document}, context) {

      performCheck(this.check, context.currentUser, document);

      return newMutation({
        collection: context.Conversations,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'conversationsEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'conversations.edit.own') : Users.canDo(user, `conversations.edit.all`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Conversations.findOne(documentId);
      performCheck(this.check, context.currentUser, document);

      return editMutation({
        collection: context.Conversations,
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

    name: 'conversationsRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.owns(user, document) ? Users.canDo(user, 'conversations.remove.own') : Users.canDo(user, `conversations.remove.all`);
    },

    mutation(root, {documentId}, context) {

      const document = context.Conversations.findOne(documentId);

      performCheck(this.check, context.currentUser, document);

      return removeMutation({
        collection: context.Conversations,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};



export default mutations;
