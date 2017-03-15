import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';

export class FormMessages extends Component {
  render () {
    const { messages = [], className = "messages", style = {} } = this.props;
    return messages.length > 0 && (
      <div className="messages">
        {messages
          .filter(message => !('field' in message))
          .map(({ message, type }, i) =>
          <Accounts.ui.FormMessage
            message={message}
            type={type}
            key={i}
          />
        )}
      </div>
    );
  }
}

Accounts.ui.FormMessages = FormMessages;
