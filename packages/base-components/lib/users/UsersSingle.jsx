import React, { PropTypes, Component } from 'react';

const UsersSingle = ({document, currentUser}) => {
  const user = document;
  return (
    <p>Profile for {Users.getDisplayName(user)}</p>
  )
}

UsersSingle.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}

module.exports = UsersSingle;