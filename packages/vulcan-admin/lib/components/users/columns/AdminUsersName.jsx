import React from 'react';
import { Link } from 'react-router';
import Users from 'meteor/vulcan:users';
import { Components } from 'meteor/vulcan:core';

const AdminUsersName = ({ user }) =>
  <div>
    <Link to={Users.getProfileUrl(user)}>
      <Components.Avatar user={user} link={false}/> <span>{Users.getDisplayName(user)}</span>
    </Link> 
    {_.rest(Users.getGroups(user)).map(group => <code key={group}>{group}</code>)}
  </div>

export default AdminUsersName;