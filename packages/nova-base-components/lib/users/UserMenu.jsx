import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import Router from './../router';
import { Dropdown, MenuItem } from 'react-bootstrap';

const UserMenu = ({user}) => {

  ({UserAvatar, UserName,IsAdmin} = Telescope.components);

  const settingsMenuItem =  Users.is.admin(user) ? <MenuItem className="dropdown-item" eventKey="3" href={Router.path("adminSettings")}>Settings</MenuItem> : "";

  return (
    <Dropdown id="user-dropdown" className="user-menu-dropdown">
      <Dropdown.Toggle>
        <UserAvatar size="small" user={user} link={false} />
        <div>{Users.getDisplayName(user)}</div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <MenuItem className="dropdown-item" eventKey="1" href={Router.path("users.single", {slug: user.telescope.slug})}>Profile</MenuItem>
        <MenuItem className="dropdown-item" eventKey="2" href={Router.path("account")}>Edit Account</MenuItem>
        {settingsMenuItem}
        <MenuItem className="dropdown-item" eventKey="4" onClick={() => Meteor.logout(Accounts.ui._options.onSignedOutHook())}>Log Out</MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  ) 
}

module.exports = UserMenu;
export default UserMenu;