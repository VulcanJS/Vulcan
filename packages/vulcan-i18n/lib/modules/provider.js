import React, { Component } from 'react';
import { getString } from 'meteor/vulcan:lib';
import { intlShape } from './shape.js';

export default class IntlProvider extends Component{

  formatMessage = ({ id, defaultMessage }, values) => {
    return getString({ id, defaultMessage, values, locale: this.props.locale });
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
