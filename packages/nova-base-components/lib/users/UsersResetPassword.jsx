import { registerComponent, withCurrentUser } from 'meteor/nova:core';
import React, { Component } from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { Link } from 'react-router';

class UsersResetPassword extends Component {
  componentDidMount() {
    const token = this.props.params.token;
    Accounts._loginButtonsSession.set('resetPasswordToken', token);
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Accounts.ui.LoginForm
          formState={ STATES.PASSWORD_CHANGE }
        />
      );
    }

    return (
      <div className='password-reset-form'>
        <div>{T9n.get('info.passwordChanged')}!</div>
        <Link to="/">
          Return Home
        </Link>
      </div>
    );
  }
}


UsersResetPassword.propsTypes = {
  currentUser: React.PropTypes.object,
  params: React.PropTypes.object,
};

UsersResetPassword.displayName = 'UsersResetPassword';

registerComponent('UsersResetPassword', UsersResetPassword, withCurrentUser);
