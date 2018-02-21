import React, { Component } from 'react';
import { getSetting, Strings } from 'meteor/vulcan:lib';
import { intlShape } from './shape.js';

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

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
        message = message.replaceAll(`{${key}}`, value);
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
