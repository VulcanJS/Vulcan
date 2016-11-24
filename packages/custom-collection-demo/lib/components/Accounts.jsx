import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { withApollo } from 'react-apollo';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});

const AccountsComponent = ({client}) => {
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
      return <a href={ href } className={ className } onClick={ onClick }>{ label }</a>;
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

  // see https://github.com/studiointeract/accounts-ui/issues/60
  triggerUpdate () {
    const { onChange } = this.props
    if (this.input) {
      onChange({ target: { value: this.input.value } })
    }
  }
  
  render() {
    const { id, hint, label, type = 'text', onChange, className = "field", defaultValue = "" } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <div className={ className }>
        <FormControl id={ id } type={ type } onChange={ onChange } placeholder={ hint } defaultValue={ defaultValue } />
      </div>
    ) : null;
  }
}

Accounts.ui.Button = AccountsButton;
Accounts.ui.Field = AccountsField;

export default withApollo(AccountsComponent);