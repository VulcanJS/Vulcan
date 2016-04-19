import React, { PropTypes, Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button, Input } from 'react-bootstrap';

const AccountsMenu = () => {

  ({UsersAvatar, UserName, AccountsForm} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="users-accounts-menu">
      <Dropdown.Toggle>
        Log In
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <AccountsForm />
      </Dropdown.Menu>
    </Dropdown>
  ) 
};

module.exports = AccountsMenu;
export default AccountsMenu;