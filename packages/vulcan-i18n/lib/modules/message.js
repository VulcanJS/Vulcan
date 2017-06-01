import React, { Component } from 'react';

import { getSetting, Strings } from 'meteor/vulcan:lib';

const FormattedMessage = ({ id }) => {
  const messages = Strings[getSetting('locale', 'en')] || {};
  return <span className="i18n-message">{messages[id]}</span>
}

export default FormattedMessage;