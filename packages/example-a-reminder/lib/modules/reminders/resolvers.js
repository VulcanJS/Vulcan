/*

two resolvers are defined:

- list (e.g.: remindersList(terms: JSON, offset: Int, limit: Int) )
- single (e.g.: reminderSingle(_id: String) )


*/
import { GraphQLSchema } from 'meteor/vulcan:core';

// add the "user" resolver for the Movie type separately
const reminderResolver = {
  Reminder: {
    user(reminder, args, context) {
      return context.Users.findOne({ _id: reminder.userId }, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
  },
};
GraphQLSchema.addResolvers(reminderResolver);

// basic list, single, and total query resolvers
const resolvers = {

  list: {

    name: 'remindersList',

    resolver(root, {terms = {}}, context, info) {
      let {selector, options} = context.reminders.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.fields = context.getViewableFields(context.currentUser, context.Reminders);
      return context.Reminders.find(selector, options).fetch();
    },

  },

  single: {

    name: 'remindersSingle',

    resolver(root, {documentId}, context) {
      const document = context.Reminders.findOne({_id: documentId});
      return _.pick(document, _.keys(context.getViewableFields(context.currentUser, context.Reminders, document)));
    },

  },
};

export default resolvers;
