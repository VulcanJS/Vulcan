import { GraphQLSchema, Utils } from 'meteor/vulcan:lib';
import Users from 'meteor/vulcan:users';

const resolvers = {

  list: {

    name: 'notificationsList',

    check(user, terms, Notifications) {
      const {selector, options} = Notifications.getParameters(terms);
      return user && user._id == selector.userId;
    },

    resolver(root, {terms}, {currentUser, Notifications, Users}, info) {

      // check that the current user can access the current query terms
      Utils.performCheck(this.check, currentUser, terms, Notifications);

      // get selector and options from terms and perform Mongo query
      let {selector, options} = Notifications.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 1000) ? 1000 : terms.limit;
      options.skip = terms.offset;
      const notifications = Notifications.find(selector, options).fetch();

      //restrict document fields
      const restrictedNotifications = Users.restrictViewableFields(currentUser, Notifications, notifications);

      //prime the cache
      restrictedNotifications.forEach(notification => Notifications.loader.prime(notification._id, notification));

      return restrictedNotifications;
    },

  },

  single: {

    name: 'notificationsSingle',

    resolver(root, {documentId}, context) {
      return context.Notifications.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Notifications) });
    },

  },

  total: {

    name: 'notificationsTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.Notifications.getParameters(terms);
      return context.Notifications.find(selector).count();
    },

  }
};

export default resolvers;
