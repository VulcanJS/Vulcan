import { GraphQLSchema, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
// TODO: Replace this with the default resolvers, and add checkDocument function
const resolvers = {

  list: {

    name: 'LWEventsList',

    check(user, terms, LWEvents) {
      const {selector, options} = LWEvents.getParameters(terms);
      // Users can query their own events, admins can query all events
      return user && ((Users.canDo(user, 'events.view.own') && user._id == selector.userId) || Users.canDo(user, 'events.view.all'));
    },

    resolver(root, {terms}, {currentUser, LWEvents, Users}, info) {
      // console.log("LWEvents resolver terms", terms);

      // check that the current user can access the current query terms
      Utils.performCheck(this.check, currentUser, terms, LWEvents);

      // get selector and options from terms and perform Mongo query
      let {selector, options} = LWEvents.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 1000) ? 1000 : terms.limit;
      options.skip = terms.offset;
      const events = LWEvents.find(selector, options).fetch();
      // console.log("LWEvents resolver events", events);

      //restrict document fields
      const restrictedEvents = Users.restrictViewableFields(currentUser, LWEvents, events);

      //prime the cache
      restrictedEvents.forEach(event => LWEvents.loader.prime(event._id, event));

      return restrictedEvents;
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
      const document = context.LWEvents.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.LWEvents) });
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
