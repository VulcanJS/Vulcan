/*

Hook and HoC that provides access to flash messages stored in reactive state

*/
import React from 'react';
import {
  createReactiveState,
  Random,
} from 'meteor/vulcan:lib';
import { intlShape, useIntl } from 'meteor/vulcan:i18n';

const messagesSchema = {
  messages: {
    type: Array,
    arrayItem: {
      type: Object,
      blackbox: true,
    },
    defaultValue: [],
  },
};

const messagesState = createReactiveState({stateKey: 'messagesState', schema: messagesSchema});

const normalizeMessage = (messageObject, intl) => {
  if (typeof messageObject === 'string') {
    // if error is a string, use it as message
    return {
      message: messageObject,
      type: 'error',
    };
  } else {
    // else return full error object after internationalizing message
    const { id = 'error', type, message, properties } = messageObject;
    const translatedMessage = intl.formatMessage(
      { id, defaultMessage: message },
      properties,
    );

    const transformedType = type === 'error' ? 'danger' :
      !['danger', 'success', 'warning'].includes(type) ? 'info' :
        type;

    return {
      ...messageObject,
      message: translatedMessage,
      type: transformedType,
      _id: Random.id(),
    };
  }
};

export const useMessages = (intl) => {
  intl = intl || useIntl();

  const messagesProps = {

    messagesState,

    messages: messagesState().messages,

    flash: (message) => {
      message = normalizeMessage(message, intl);
      messagesState({ messages: { $push: [message] } });
    },

    dismissFlash: (_id) => {
      // mark message as dismissed
      const messages = messagesState().messages;
      const message = messages.find(message => message._id === _id);
      if (message) {
        message.dismissed = true;
      }

      // if all messages are dismissed, empty the messages array
      const hasUnDismissed = messages.find(message => !message.dismissed);
      if (!hasUnDismissed) {
        messagesState({ messages: [] });
      }
    },

    dismissAllFlash: () => {
      messagesState({ messages: [] });
    },

  };

  return messagesProps;
};

export const withMessages = WrappedComponent => {
  class MessagesComponent extends React.Component {
    render() {
      const intl = this.context.intl;
      const messagesProps = useMessages(intl);
      return <WrappedComponent {...this.props} {...messagesProps} />;
    }
  }

  MessagesComponent.contextTypes = {
    intl: intlShape
  };

  MessagesComponent.displayName = `withMessages(${WrappedComponent.displayName})`;

  return MessagesComponent;
};
