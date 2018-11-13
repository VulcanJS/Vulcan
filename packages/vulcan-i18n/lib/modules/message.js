import React, { Component } from 'react';
import { intlShape } from './shape';

const FormattedMessage = ({ id, values, defaultMessage = '', html = false, className = '' }, { intl }) => {
  const message = intl.formatMessage({ id, defaultMessage }, values);
  const cssClass = `i18n-message ${className}`;

  return html ? 
    <span className={cssClass} dangerouslySetInnerHTML={{__html: message}}/> :
    <span className={cssClass}>{message}</span>
}

FormattedMessage.contextTypes = {
  intl: intlShape
}

export default FormattedMessage;
