import React, { PropTypes, Component } from 'react';
import Router from '../router.js';
import { Dropdown } from 'react-bootstrap';
import { Button, Input } from 'react-bootstrap';

import { Accounts } from 'meteor/std:accounts-ui';

const AccountsMenu = () => {

  ({UserAvatar, UserName} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="user-menu-dropdown">
      <Dropdown.Toggle>
        Log In
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Accounts.ui.LoginForm />
      </Dropdown.Menu>
    </Dropdown>
  ) 
};

module.exports = AccountsMenu;
export default AccountsMenu;

// customize Accounts.ui

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});

class AccountsButton extends Accounts.ui.Button {
  render() {
    const { label, type, disabled = false, onClick, className } = this.props;
    return type == 'link' ? (
      <Button bsStyle="default" href="#" className={className} onClick={onClick} >{label}</Button>
    ) : (
      <Button bsStyle="primary" className={className} onClick={onClick} disabled={disabled}>{label}</Button>
    );
  }
}

class AccountsField extends Accounts.ui.Field {
  render() {
    const { id, hint, label, type = 'text', onChange, className = "field" } = this.props;
    return (
      <div className={className}>
        <Input name={id} id={id} type={type} onChange={onChange} placeholder={hint} defaultValue="" />
      </div>
    );
  }
}

Accounts.ui.Button = AccountsButton;
Accounts.ui.Field = AccountsField;