import React, { Component } from 'react';
import { getSetting, Strings } from 'meteor/vulcan:lib';

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const FormattedMessage = ({ id, values, defaultMessage = '', html = false }) => {
  const messages = Strings[getSetting('locale', 'en')] || {};
  let message = messages[id] || defaultMessage;
  if (message && values) {
    _.forEach(values, (value, key) => {
      message = message.replaceAll(`{${key}}`, value);
    });
  }
  return html ? 
    <span className="i18n-message" dangerouslySetInnerHTML={{__html: message}}/> :
    <span className="i18n-message">{message}</span>
}

export default FormattedMessage;
