import React, { PropTypes, Component } from 'react';

const UsersName = ({user}) => <a className="users-name" href={Users.getProfileUrl(user)}>{Users.getDisplayName(user)}</a>

UsersName.propTypes = {
  user: React.PropTypes.object.isRequired,
}

module.exports = UsersName;
export default UsersName;