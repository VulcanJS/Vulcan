import React, { PropTypes, Component } from 'react';

const UserSingle = ({document, currentUser}) => {
  const user = document;
  return (
    <p>Profile for {Users.getDisplayName(user)}</p>
  )
}

UserSingle.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}

module.exports = UserSingle;