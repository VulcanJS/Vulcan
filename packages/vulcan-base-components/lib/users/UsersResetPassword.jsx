import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { intlShape } from 'meteor/vulcan:i18n';

class UsersResetPassword extends PureComponent {
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
  currentUser: PropTypes.object,
  params: PropTypes.object,
};

UsersResetPassword.displayName = 'UsersResetPassword';

registerComponent('UsersResetPassword', UsersResetPassword, withCurrentUser);
