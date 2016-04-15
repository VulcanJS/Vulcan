import React, { PropTypes, Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button, Input } from 'react-bootstrap';

const AccountsMenu = () => {

  ({UserAvatar, UserName, AccountsForm} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="user-menu-dropdown">
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