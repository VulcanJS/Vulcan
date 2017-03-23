import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { withApollo } from 'react-apollo';
import { registerComponent } from 'meteor/nova:core';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});

const AccountsForm = ({client}) => {
  return (
    <div style={{padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid #ccc'}} >
      <Accounts.ui.LoginForm 
        onPostSignUpHook={() => client.resetStore()}
        onSignedInHook={() => client.resetStore()}
        onSignedOutHook={() => client.resetStore()}
      />
    </div>
  )
}

export default withApollo(AccountsForm);