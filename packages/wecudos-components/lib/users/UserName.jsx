import React, { PropTypes, Component } from 'react';

const UserName = ({user}) => <a className="user-name" href={Users.getProfileUrl(user)}>{Users.getDisplayName(user)}</a>

UserName.propTypes = {
  user: React.PropTypes.object.isRequired,
}

module.exports = UserName;
export default UserName;