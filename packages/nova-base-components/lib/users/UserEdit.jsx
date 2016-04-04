import React, { PropTypes, Component } from 'react';

import NovaForm from "meteor/nova:forms";

import Core from "meteor/nova:core";
const Messages = Core.Messages;

const UserEdit = ({document, currentUser}) => {

  const user = document;
  //const label = `Edit profile for ${Users.getDisplayName(user)}`;

  ({CanEditUser} = Telescope.components);

  return (
    <CanEditUser user={currentUser} userToEdit={user}>
      <div className="edit-user-form">
        <h3>Edit Account</h3>
        <NovaForm 
          currentUser={currentUser}
          collection={Meteor.users} 
          document={user} 
          methodName="users.edit"
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Meteor.users)}
          successCallback={(user)=>{
            Messages.flash("User updated.", "success");
          }}
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
export default UserEdit;