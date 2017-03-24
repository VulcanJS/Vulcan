import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class AccountsFormMessages extends Component {
  render () {
    const { messages = [], className = "messages", style = {} } = this.props;
    return messages.length > 0 && (
      <div className="messages">
        {messages
          .filter(message => !('field' in message))
          .map(({ message, type }, i) =>
          <Components.AccountsFormMessage
            message={message}
            type={type}
            key={i}
          />
        )}
      </div>
    );
  }
}

registerComponent('AccountsFormMessages', AccountsFormMessages);