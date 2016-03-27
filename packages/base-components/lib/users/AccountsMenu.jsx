import React, { PropTypes, Component } from 'react';
import Router from '../router.js'
import { Dropdown } from 'react-bootstrap';

const AccountsMenu = ({user}) => {

  ({UserAvatar, UserName} = Telescope.components);

  return (
    <Dropdown id="accounts-dropdown" className="user-menu-dropdown">
      <Dropdown.Toggle>
        Log In
      </Dropdown.Toggle>
      <Dropdown.Menu>
        *log in form goes here*
      </Dropdown.Menu>
    </Dropdown>
  ) 
}

module.exports = AccountsMenu;
export default AccountsMenu;