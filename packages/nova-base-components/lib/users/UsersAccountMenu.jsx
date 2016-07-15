import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Button } from 'react-bootstrap';

const UsersAccountMenu = () => {

  return (
    <Dropdown id="accounts-dropdown" className="users-account-menu">
      <Dropdown.Toggle>
        <FormattedMessage id="users.log_in"/>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Telescope.components.UsersAccountForm />
      </Dropdown.Menu>
    </Dropdown>
  ) 
};

UsersAccountMenu.displayName = "UsersAccountMenu";

module.exports = UsersAccountMenu;
export default UsersAccountMenu;