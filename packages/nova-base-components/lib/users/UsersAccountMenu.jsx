import React, { PropTypes, Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button, Input } from 'react-bootstrap';

const UsersAccountMenu = () => {

  ({UsersAvatar, UsersName, AccountsForm} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="users-account-menu">
      <Dropdown.Toggle>
        Log In
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <AccountsForm />
      </Dropdown.Menu>
    </Dropdown>
  ) 
};

module.exports = UsersAccountMenu;
export default UsersAccountMenu;