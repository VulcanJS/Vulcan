import React, { PropTypes, Component } from 'react';
import { Accounts } from 'meteor/std:accounts-ui';
import { withApollo } from 'react-apollo';
import { Components, registerComponent } from 'meteor/nova:core';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});

const AccountsForm = ({client}) => {
  return (
    <div style={{padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid #ccc'}} >
      <Components.AccountsLoginForm 
        onPostSignUpHook={() => client.resetStore()}
        onSignedInHook={() => client.resetStore()}
        onSignedOutHook={() => client.resetStore()}
      />
    </div>
  )
}

export default withApollo(AccountsForm);