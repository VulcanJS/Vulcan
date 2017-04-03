import { GraphQLSchema } from 'meteor/vulcan:lib';

const specificResolvers = {
  Conversation: {
    participants(conversation, args, context) {
      var participantArray = [];
      conversation.participantIds.forEach(participantId => {
        let participant = context.Users.findOne({_id: participantId}, {fields: context.getViewableFields(context.currentUser, context.Users)});
        participantArray.push(participant);
      });
      return participantArray;
    }
  }
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'conversationsList',

    resolver(root, {terms}, context, info) {
      let {selector, options} = context.Conversations.getParameters(terms);

      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Conversations);
      return context.Conversations.find(selector, options).fetch();
    },

  },

  single: {

    name: 'conversationsSingle',

    resolver(root, {documentId}, context) {
      return context.Conversations.findOne({_id: documentId}, { fields: context.getViewableFields(context.currentUser, context.Conversations) });
    },

  },

  total: {

    name: 'conversationsTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.Conversations.getParameters(terms);
      return context.Conversations.find(selector).count();
    },

  }
};


export default resolvers;
