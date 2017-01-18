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
    <div>
      <Accounts.ui.LoginForm 
        onPostSignUpHook={() => client.resetStore()}
        onSignedInHook={() => client.resetStore()}
        onSignedOutHook={() => client.resetStore()}
      />
    </div>
  )
}

class AccountsButton extends Accounts.ui.Button {
  render () {
    const {label, href, type, disabled, className, onClick} = this.props;
    if (type === 'link') {
      return <a href={ href } className={ className } onClick={ onClick }>{ label }</a>;
    }
    return <Button 
        bsStyle="primary"
        className={ className }
        type={ type }
        disabled={ disabled }
        onClick={ onClick }>{ label }
      </Button>;
  }
}

class AccountsField extends Accounts.ui.Field {

  render() {
    const { id, hint, /* label, */ type = 'text', onChange, className = "field", defaultValue = "", message } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <div className={ className }>
        <FormControl id={ id } type={ type } inputRef={ref => { this.input = ref; }} onChange={ onChange } placeholder={ hint } defaultValue={ defaultValue } />
        {message && (
          <span className={['message', message.type].join(' ').trim()}>
            {message.message}</span>
        )}
      </div>
    ) : null;
  }
}

Accounts.ui.Button = AccountsButton;
Accounts.ui.Field = AccountsField;

registerComponent('AccountsForm', AccountsForm, withApollo);
