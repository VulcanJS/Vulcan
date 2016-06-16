import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
//import { Messages } from "meteor/nova:core";

const UsersEdit = ({document, currentUser}, context) => {

  const user = document;
  //const label = `Edit profile for ${Users.getDisplayName(user)}`;

  return (
    <Telescope.components.CanEditUser user={currentUser} userToEdit={user}>
      <div className="page users-edit-form">
        <h2 className="page-title users-edit-form-title"><FormattedMessage id="users.edit_account"/></h2>
        <NovaForm 
          currentUser={currentUser}
          collection={Meteor.users} 
          document={user} 
          methodName="users.edit"
          successCallback={(user)=>{
            context.messages.flash("User updated.", "success");
          }}
        />
      </div>
    </Telescope.components.CanEditUser>
  )
};

  
UsersEdit.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
};

UsersEdit.contextTypes = {
  messages: React.PropTypes.object
};

UsersEdit.displayName = "UsersEdit";

module.exports = UsersEdit;
export default UsersEdit;