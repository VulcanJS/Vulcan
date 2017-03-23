import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React from 'react';

const FlashMessages = ({messages, clear, markAsSeen}) => {
  return (
    <div className="flash-messages">
      {messages
        .filter(message => message.show)
        .map(message => <Components.Flash key={message._id} message={message} clear={clear} markAsSeen={markAsSeen} />)}
    </div>
  );
}

FlashMessages.displayName = "FlashMessages";

registerComponent('FlashMessages', FlashMessages, withMessages);
