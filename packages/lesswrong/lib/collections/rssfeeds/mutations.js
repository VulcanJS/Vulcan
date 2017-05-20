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
      if (!user || !document) return false;
      return ((Users.canDo(user, 'rssfeeds.new.own') && user._id == document.userId) || (Users.canDo(user, 'rssfeeds.new')))
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
      return Users.owns(user, document) ? Users.canDo(user, 'rssfeeds.edit.own') : Users.canDo(user, `rssfeeds.edit.all`);
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
      return Users.owns(user, document) ? Users.canDo(user, 'rssfeeds.remove.own') : Users.canDo(user, `rssfeeds.remove.all`);
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
