import { GraphQLSchema } from 'meteor/vulcan:lib';

const specificResolvers = {
  Message: {
    user(message, args, context) {
      return context.Users.findOne({_id: message.userId}, {fields: context.getViewableFields(context.currentUser, context.Users)});
    },
    conversation(message, args, context) {
      return context.Conversations.findOne({_id: message.conversationId}, {fields: context.getViewableFields(context.currentUser, context.Conversations)});
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'messageList',

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Messages.getParameters(terms);

      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Messages);
      return context.Messages.find(selector, options).fetch();
    },

  },

  single: {

    name: 'messageSingle',

    resolver(root, {documentId}, context) {
      return context.Messages.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Messages) });
    },

  },

  total: {

    name: 'messageTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.Messages.getParameters(terms);
      return context.Messages.find(selector).count();
    },

  }
};


export default resolvers;
