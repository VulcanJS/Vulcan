import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown } from 'react-bootstrap';
import { STATES } from 'meteor/vulcan:accounts';

const UsersAccountMenu = ({state}) =>

  <Dropdown id="accounts-dropdown" className="users-account-menu">
    <Dropdown.Toggle>
      <Components.Icon name="user"/>
      <FormattedMessage id="users.sign_up_log_in"/>
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <Components.AccountsLoginForm formState={state? STATES[state] : STATES.SIGN_UP} />
    </Dropdown.Menu>
  </Dropdown>

UsersAccountMenu.displayName = "UsersAccountMenu";

registerComponent('UsersAccountMenu', UsersAccountMenu);
