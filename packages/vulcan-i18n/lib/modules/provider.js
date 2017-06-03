import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSetting, Strings } from 'meteor/vulcan:lib';

import { intlShape } from './shape.js';

export default class IntlProvider extends Component{
  
  constructor(){
    super();
    this.formatMessage = this.formatMessage.bind(this);
  }

  formatMessage({ id, defaultMessage }, values) {
    const messages = Strings[getSetting('locale', 'en')] || {};
    let message = messages[id] || defaultMessage;
    if (values) {
      _.forEach(values, (value, key) => {
        message = message.replace(`{${key}}`, value);
      });
    }
    return message;
  }

  formatStuff(something) {
    return something;
  }

  getChildContext() {
    return {
      intl: {
        formatDate: this.formatStuff,
        formatTime: this.formatStuff,
        formatRelative: this.formatStuff,
        formatNumber: this.formatStuff,
        formatPlural: this.formatStuff, 
        formatMessage: this.formatMessage,
        formatHTMLMessage: this.formatStuff,
        now: this.formatStuff,
      }
    };
  }
  
  render(){
    return this.props.children;
  }

}

IntlProvider.childContextTypes = {
  intl: intlShape
}