import React, { Component } from 'react';
import { Strings } from 'meteor/vulcan:lib';
import { intlShape } from './shape.js';

export default class IntlProvider extends Component{

  formatMessage = ({ id, defaultMessage }, values) => {
    const messages = Strings[this.props.locale] || {};
    let message = messages[id] || defaultMessage;
    if (message && values) {
      _.forEach(values, (value, key) => {
        // note: see replaceAll definition in vulcan:lib/utils
        message = message.replaceAll(`{${key}}`, value);
      });
    }
    return message;
  }

  formatStuff = (something) => {
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
