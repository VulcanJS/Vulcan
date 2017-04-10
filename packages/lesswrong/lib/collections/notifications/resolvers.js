import { GraphQLSchema } from 'meteor/vulcan:lib';

const resolvers = {

  list: {

    name: 'notificationsList',

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Notifications.getParameters(terms);

      options.limit = (terms.limit < 1 || terms.limit > 1000) ? 1000 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Notifications);
      return context.Notifications.find(selector, options).fetch();
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
