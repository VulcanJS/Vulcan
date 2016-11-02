import React, { Component } from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { Link } from 'react-router';

class UsersResetPassword extends Component {
  componentDidMount() {
    const token = this.props.params.token;
    Accounts._loginButtonsSession.set('resetPasswordToken', token);
  }

  render() {
    if (!this.context.currentUser) {
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

module.exports = UsersResetPassword;
export default UsersResetPassword;

UsersResetPassword.contextTypes = {
  currentUser: React.PropTypes.object
};
