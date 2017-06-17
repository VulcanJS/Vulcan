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
  if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
}

const mutations = {

  new: {

    name: 'rssFeedsNew',

    check(user, document) {
      // For now we only let admins add new RSS feeds. We will change this at a later point in time
      // TODO: Change permissions to allow users to add their own RSS feeds id:26
      if (!user || !document) return false;
      return Users.isAdmin(user);
    },

    mutation(root, {document}, context) {

      performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.RSSFeeds,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'rssFeedsEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.isAdmin(user);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.RSSFeeds.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.RSSFeeds,
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

    name: 'rssFeedsRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.isAdmin(user);
    },

    mutation(root, {documentId}, context) {

      const document = context.RSSFeeds.findOne(documentId);

      performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.RSSFeeds,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};


export default mutations;
