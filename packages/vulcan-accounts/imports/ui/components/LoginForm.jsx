import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class AccountsLoginForm extends React.Component {

  render() {
    return(
      <Components.AccountsStateSwitcher {...this.props}/>
    );
  }
}

registerComponent('AccountsLoginForm', AccountsLoginForm);