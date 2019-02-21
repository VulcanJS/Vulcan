import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { STATES } from '../../helpers.js';

class AccountsEnrollAccount extends PureComponent {
  componentDidMount() {
    const token = this.props.params.token;
    Accounts._loginButtonsSession.set('enrollAccountToken', token);
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Components.AccountsLoginForm
          formState={ STATES.ENROLL_ACCOUNT }
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

AccountsEnrollAccount.contextTypes = {
  intl: intlShape
};

AccountsEnrollAccount.propsTypes = {
  currentUser: PropTypes.object,
  params: PropTypes.object,
};

AccountsEnrollAccount.displayName = 'AccountsEnrollAccount';

registerComponent('AccountsEnrollAccount', AccountsEnrollAccount, withCurrentUser);
