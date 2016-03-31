import React, { PropTypes, Component } from 'react';
import {EditDocument} from 'meteor/nova:forms';

const UserEdit = ({document, currentUser}) => {

  const user = document;
  //const label = `Edit profile for ${Users.getDisplayName(user)}`;

  ({CanEditUser} = Telescope.components);

  const editComponent = renderEditDocument(currentUser,user);

  return (
    <CanEditUser user={currentUser} userToEdit={user}>
      <div className="edit-user-form">
        <h3>Edit Account</h3>
          {editComponent}
      </div>
    </CanEditUser>
  )
}

const renderEditDocument = (currentUser,user) => (
    <EditDocument
        currentUser={currentUser}
        collection={Meteor.users}
        document={user}
        methodName="users.edit"
    />
);

  
UserEdit.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}

module.exports = UserEdit;
export default UserEdit;