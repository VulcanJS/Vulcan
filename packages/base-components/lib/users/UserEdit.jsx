import React, { PropTypes, Component } from 'react';

const UserEdit = ({document, currentUser}) => {

  const user = document;
  const label = `Edit profile for ${Users.getDisplayName(user)}`;

  ({CanEditUser, EditDocument} = Telescope.components);

  return (
    <CanEditUser user={currentUser} userToEdit={user}>
      <EditDocument collection={Meteor.users} document={user} label={label} methodName="users.edit"/>
    </CanEditUser>
  )
}
  
UserEdit.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}

module.exports = UserEdit;