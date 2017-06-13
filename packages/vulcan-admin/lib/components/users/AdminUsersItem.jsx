import React from 'react';
import Users from 'meteor/vulcan:users';
import { Link } from 'react-router';
import { Components } from 'meteor/vulcan:core';
import moment from 'moment';

const AdminUsersItem = ({ user }) =>
  <tr className="admin-users-item">
    <td className="admin-users-item-name"><Link to={Users.getProfileUrl(user)}><Components.UsersAvatar user={user} link={false}/> <span>{Users.getDisplayName(user)}</span></Link></td>
    <td className="admin-users-item-email"><a href={`mailto:${Users.getEmail(user)}`}>{Users.getEmail(user)}</a></td>
    <td className="admin-users-item-created">{moment(new Date(user.createdAt)).format('MM/DD/YY')}</td>
    <td className="admin-users-item-groups">{_.rest(Users.getGroups(user)).map(group => <code key={group}>{group}</code>)}</td>
  </tr>

export default AdminUsersItem;