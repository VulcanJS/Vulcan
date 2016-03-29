import React, { PropTypes, Component } from 'react';

const UserEdit = ({document, currentUser}) => {

  const user = document;
  const label = `Edit profile for ${Users.getDisplayName(user)}`;

  ({CanEditUser, EditDocument} = Telescope.components);

  return (
    <CanEditUser user={currentUser} userToEdit={user}>
      <div className="edit-user-form">
        <h3>Edit Account</h3>
        <EditDocument 
          currentUser={currentUser}
          collection={Meteor.users} 
          document={user} 
          methodName="users.edit"
        />
      </div>
    </CanEditUser>
  )
}
  
UserEdit.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}

module.exports = UserEdit;