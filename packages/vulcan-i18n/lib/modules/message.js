import React from 'react';
import { getSetting, registerSetting, Strings } from 'meteor/vulcan:lib';

const FormattedMessage = ({ id, values, defaultMessage }) => {
  const messages = Strings[getSetting('locale', 'en')] || {};
  let message = messages[id] || defaultMessage;
  if (!message) {
    throw new Error(`No FormattedMessage for id "${id}"`);
  }
  if (values) {
    _.forEach(values, (value, key) => {
      message = message.replace(`{${key}}`, value);
    });
  }
  return <span className="i18n-message">{message}</span>
};

export default FormattedMessage;
