/*

HoC that provides access to flash messages stored in context

*/
import React from 'react';
import MessageContext from '../messages.js';

const withMessages = WrappedComponent => {
  class MessagesComponent extends React.Component {
    render() {
      return (
        <MessageContext.Consumer>
          {messageProps => <WrappedComponent {...this.props} {...messageProps} />}
        </MessageContext.Consumer>
      );
    }
  }
  MessagesComponent.displayName = `withMessages(${WrappedComponent.displayName})`;

  return MessagesComponent;
};

export default withMessages;
