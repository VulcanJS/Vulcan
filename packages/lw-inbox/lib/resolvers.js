import { GraphQLSchema } from 'meteor/nova:lib';

const specificConversationResolvers = {
  Conversation: {
    participants(conversation, args, context) {
      var participantArray = [];
      conversation.participants.forEach(participantId => {
        let participant = context.Users.findOne({_id: participantId}, {fields: context.getViewableFields(context.currentUser, context.Users)});
        participantArray.push(participant);
      });
      return participantArray;
    },
    messages(conversation, args, context) {
      var messageArray = [];
      conversation.messageIds.forEach(function (messageId) {
        let message = context.Messages.findOne({_id: messageId}, {fields: context.getViewableFields(context.currentUser, context.Messages)});
        messageArray.push(message);
      });
      return messageArray;
    },
  },
  Mutation: {
    addMessageToConversation(root, { conversationId, messageId }, context) {
      return context.Conversations.update({_id: conversationId}, {$push: {messageIds: messageId}});
    }
  }
};

GraphQLSchema.addResolvers(specificConversationResolvers);

const specificMessageResolvers = {
  Message: {
    user(message, args, context) {
      return context.Users.findOne({_id: message.userId}, {fields: context.getViewableFields(context.currentUser, context.Users)});
    },
    conversation(message, args, context) {
      return context.Conversations.findOne({_id: message.conversationId}, {fields: context.getViewableFields(context.currentUser, context.Conversations)});
    },
  },
};

GraphQLSchema.addResolvers(specificMessageResolvers);

const ConversationResolvers = {

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

const MessageResolvers = {

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


export {
  ConversationResolvers,
  MessageResolvers
};
