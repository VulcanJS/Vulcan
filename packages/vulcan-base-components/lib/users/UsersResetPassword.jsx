import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { intlShape } from 'react-intl';

class UsersResetPassword extends Component {
  componentDidMount() {
    const token = this.props.params.token;
    Accounts._loginButtonsSession.set('resetPasswordToken', token);
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Components.AccountsLoginForm
          formState={ Symbol('PASSWORD_CHANGE') }
        />
      );
    }

    return (
      <div className='password-reset-form'>
        <div>{this.context.intl.formatMessage({id: 'accounts.info_password_changed'})}!</div>
        <Link to="/">
          Return Home
        </Link>
      </div>
    );
  }
}

UsersResetPassword.contextTypes = {
  intl: intlShape
}

UsersResetPassword.propsTypes = {
  currentUser: React.PropTypes.object,
  params: React.PropTypes.object,
};

UsersResetPassword.displayName = 'UsersResetPassword';

registerComponent('UsersResetPassword', UsersResetPassword, withCurrentUser);
