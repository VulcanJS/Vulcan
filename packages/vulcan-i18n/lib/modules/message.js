import React, { Component } from 'react';

import { getSetting, Strings } from 'meteor/vulcan:lib';

const FormattedMessage = ({ id, values }) => {
  const messages = Strings[getSetting('locale', 'en')] || {};
  let message = messages[id];
  if (values) {
    _.forEach(values, (value, key) => {
      message = message.replace(`{${key}}`, value);
    });
  }
  return <span className="i18n-message">{messages[id]}</span>
}

export default FormattedMessage;