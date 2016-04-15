import React from 'react';

const FlashMessages = ({messages}) => {
  ({Flash} = Telescope.components);
  return (
    <div className="flash-messages">
      {messages.map((message, index) => <Flash key={index} message={message} />)}
    </div>
  );
}

module.exports = FlashMessages;