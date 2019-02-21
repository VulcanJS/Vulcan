import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { STATES } from '../../helpers.js';

class AccountsResetPassword extends PureComponent {
  componentDidMount() {
    const token = this.props.params.token;
    Accounts._loginButtonsSession.set('resetPasswordToken', token);
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Components.AccountsLoginForm
          formState={ STATES.PASSWORD_CHANGE }
        />
      );
    } else {
      return (
        <div className='password-reset-form'>
          <div>{this.context.intl.formatMessage({id: 'accounts.info_password_changed'})}!</div>
        </div>
      );
    }
  }
}

AccountsResetPassword.contextTypes = {
  intl: intlShape
};

AccountsResetPassword.propsTypes = {
  currentUser: PropTypes.object,
  params: PropTypes.object,
};

AccountsResetPassword.displayName = 'AccountsResetPassword';

registerComponent('AccountsResetPassword', AccountsResetPassword, withCurrentUser);
