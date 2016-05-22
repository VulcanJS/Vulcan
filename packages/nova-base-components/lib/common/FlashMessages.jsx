import React from 'react';

const FlashMessages = ({messages}) => {
  return (
    <div className="flash-messages">
      {messages.map((message, index) => <Telescope.components.Flash key={index} message={message} />)}
    </div>
  );
}

FlashMessages.displayName = "FlashMessages";

module.exports = FlashMessages;