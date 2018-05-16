import React, { Component } from 'react';
import { intlShape } from './shape';

const FormattedMessage = ({ id, values, defaultMessage = '', html = false }, { intl }) => {
  const message = intl.formatMessage({ id, defaultMessage }, values);
  return html ? 
    <span className="i18n-message" dangerouslySetInnerHTML={{__html: message}}/> :
    <span className="i18n-message">{message}</span>
}

FormattedMessage.contextTypes = {
  intl: intlShape
}

export default FormattedMessage;
