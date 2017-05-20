import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown, NavDropdown } from 'react-bootstrap';

const LWUsersAccountMenu = () => {

  return (
    <NavDropdown id="accounts-dropdown" className="users-account-menu" title="Log in">
      <Components.AccountsLoginForm />
    </NavDropdown>
  )
};

LWUsersAccountMenu.displayName = "UsersAccountMenu";

registerComponent('UsersAccountMenu', LWUsersAccountMenu);
