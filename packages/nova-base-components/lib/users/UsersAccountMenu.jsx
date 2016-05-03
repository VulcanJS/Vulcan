import React, { PropTypes, Component } from 'react';
import { Dropdown, Button } from 'react-bootstrap';

const UsersAccountMenu = () => {

  ({UsersAvatar, UsersName, UsersAccountForm} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="users-account-menu">
      <Dropdown.Toggle>
        Log In
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <UsersAccountForm />
      </Dropdown.Menu>
    </Dropdown>
  ) 
};

module.exports = UsersAccountMenu;
export default UsersAccountMenu;