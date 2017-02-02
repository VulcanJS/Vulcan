import { Components, registerComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown } from 'react-bootstrap';

const UsersAccountMenu = () => {

  return (
    <Dropdown id="accounts-dropdown" className="users-account-menu">
      <Dropdown.Toggle>
        <FormattedMessage id="users.log_in"/>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Components.UsersAccountForm />
      </Dropdown.Menu>
    </Dropdown>
  )
};

UsersAccountMenu.displayName = "UsersAccountMenu";

registerComponent('UsersAccountMenu', UsersAccountMenu);
