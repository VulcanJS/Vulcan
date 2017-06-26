import { GraphQLSchema, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const specificResolvers = {
  Query: {
    lastEvent(root, {documentId, userId}, context) {
      let events = context.LWEvents.find({documentId: documentId, userId: userId}, {limit: 1, sort: {endTime: -1}}).fetch();
      return events[0];
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);
GraphQLSchema.addQuery(`lastEvent(documentId: String, userId: String): LWEvent`);

const resolvers = {

  list: {

    name: 'LWEventsList',

    check(user, terms, LWEvents) {
      const {selector, options} = LWEvents.getParameters(terms);
      // Users can query their own events, admins can query all events
      return user && ((Users.canDo(user, 'events.view.own') && user._id == selector.userId) || Users.canDo(user, 'events.view.all'));
    },

    resolver(root, {terms}, {currentUser, LWEvents, Users}, info) {

      // check that the current user can access the current query terms
      Utils.performCheck(this.check, currentUser, terms, LWEvents);

      // get selector and options from terms and perform Mongo query
      let {selector, options} = LWEvents.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 1000) ? 1000 : terms.limit;
      options.skip = terms.offset;
      const events = LWEvents.find(selector, options).fetch();

      //restrict document fields
      const restrictedEvents = Users.restrictViewableFields(currentUser, LWEvents, events);

      //prime the cache
      restrictedEvents.forEach(event => Notifications.loader.prime(event._id, event));

      return restrictedNotifications;
    },

  },

  single: {

    name: 'LWEventsSingle',

    check(user, document, LWEvents) {
      const {selector, options} = LWEvents.getParameters(terms);
      // Users can query their own events, admins can query all events
      return user && ((Users.canDo(user, 'events.view.own') && user._id == document.userId) || Users.canDo(user, 'events.view.all'));
    },

    resolver(root, {documentId}, context) {
      document = context.LWEvents.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.LWEvents) });
      Utils.performCheck(this.check, context.currentUser, document, context.LWEvents)
      return document
    },

  },

  total: {

    name: 'LWEventsTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.LWEvents.getParameters(terms);
      return context.LWEvents.find(selector).count();
    },

  }
};

export default resolvers;
