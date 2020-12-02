import React, { Component } from 'react';
import { intlShape } from './shape';
import { registerComponent } from 'meteor/vulcan:lib';

const FormattedMessage = ({ id, values, defaultMessage = '', html = false, className = '' }, { intl }) => {
  let message = intl.formatMessage({ id, defaultMessage }, values);
  const cssClass = `i18n-message ${className}`;

  // if message is empty, use [id]
  if (message === '') {
    message = `[${id}]`;
  }

  return html ? 
    <span data-key={id} className={cssClass} dangerouslySetInnerHTML={{__html: message}}/> :
    <span data-key={id} className={cssClass}>{message}</span>;
};

FormattedMessage.contextTypes = {
  intl: intlShape
};

registerComponent('FormattedMessage', FormattedMessage);

export default FormattedMessage;