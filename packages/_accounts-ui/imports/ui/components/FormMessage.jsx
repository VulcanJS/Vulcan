import React from 'react';
import { Accounts } from 'meteor/accounts-base';

export class FormMessage extends React.Component {
  render () {
    let { message, type, className = "message", style = {}, deprecated } = this.props;
    // XXX Check for deprecations.
    if (deprecated) {
      // Found backwords compatibility issue.
      console.warn('You are overriding Accounts.ui.Form and using FormMessage, the use of FormMessage in Form has been depreacted in v1.2.11, update your implementation to use FormMessages: https://github.com/studiointeract/accounts-ui/#deprecations');
    }
    message = _.isObject(message) ? message.message : message; // If message is object, then try to get message from it
    return message ? (
      <div style={ style } 
           className={[ className, type ].join(' ')}>{ message }</div>
    ) : null;
  }
}

Accounts.ui.FormMessage = FormMessage;
