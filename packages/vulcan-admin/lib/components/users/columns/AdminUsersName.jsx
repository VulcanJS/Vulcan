import React from 'react';
import Users from 'meteor/vulcan:users';
import { Components } from 'meteor/vulcan:core';

const AdminUsersName = ({ document: user, flash }) => 
  <div>

    <Components.Avatar user={user} link={false} gutter="right"/>

    <span>{Users.getDisplayName(user)}</span>

    &nbsp;

    {_.rest(Users.getGroups(user)).map(group => <code style={{ marginLeft: 8 }} key={group}>{group}</code>)}
  
  </div>;

export default AdminUsersName;
