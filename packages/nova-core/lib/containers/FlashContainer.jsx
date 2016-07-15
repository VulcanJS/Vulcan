import React from 'react';
import Messages from "../messages.js";

import { createContainer } from 'meteor/react-meteor-data';

const FlashContainer = createContainer(() => {
  return {
    messages: Messages.collection.find({show: true}).fetch()
  }
}, params => <params.component {...params} />);

FlashContainer.displayName = "FlashContainer";

module.exports = FlashContainer;
export default FlashContainer;