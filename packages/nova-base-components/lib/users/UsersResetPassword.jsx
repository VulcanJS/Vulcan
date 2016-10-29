import React, { Component } from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

class UsersResetPassword extends Component {
  componentDidMount() {
    const token = this.props.params.token;
    Accounts._loginButtonsSession.set('resetPasswordToken', token);
  }

  render() {
    return (
      <Accounts.ui.LoginForm
        formState={ STATES.PASSWORD_CHANGE }
      />
    );
  }
}

module.exports = UsersResetPassword;
export default UsersResetPassword;
