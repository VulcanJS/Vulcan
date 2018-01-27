import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class AccountsLoginForm extends React.Component {

  render() {
    return(
      <Components.AccountsStateSwitcher />
    );
  }
}

registerComponent('AccountsLoginForm', AccountsLoginForm);