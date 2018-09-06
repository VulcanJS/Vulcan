import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { withApollo } from 'react-apollo';


class AccountsVerifyEmail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      pending: true,
      error: null
    }
  }
  
  componentDidMount() {
    const token = this.props.params.token;
    Accounts.verifyEmail(token, (verifyEmailResult) => {
      if(verifyEmailResult && verifyEmailResult.error) {
        this.setState({
          pending: false,
          error: verifyEmailResult.reason
        });
      } else {
        this.setState({
          pending: false,
          error: null
        });
        
        // Reset the Apollo cache. Unfortunately there isn't
        // really a more granular way to do this (see
        // https://github.com/apollographql/apollo-feature-requests/issues/4 ).
        // For LW2, this ensures that, if you navigate from
        // the "Your email address has been verified" page
        // to the "Edit Account" page, you won't see a
        // widget telling you your address is still
        // unverified.
        this.props.client.resetStore();
      }
    });
  }
  
  render() {
    if(this.state.pending) {
      return <Components.Loading />
    } else if(this.state.error) {
      return (
        <div className='password-reset-form'>
          {this.state.error}
        </div>
      );
    } else {
      return (
        <div className='password-reset-form'>
          {this.context.intl.formatMessage({id: 'accounts.email_verified'})}
        </div>
      );
    }
  }
}

AccountsVerifyEmail.contextTypes = {
  intl: intlShape
}

AccountsVerifyEmail.propsTypes = {
  currentUser: PropTypes.object,
  params: PropTypes.object,
};

AccountsVerifyEmail.displayName = 'AccountsEnrollAccount';

registerComponent('AccountsVerifyEmail', AccountsVerifyEmail, withCurrentUser, withApollo);