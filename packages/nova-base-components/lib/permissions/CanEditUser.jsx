import React, { PropTypes, Component } from 'react';
import Users from 'meteor/nova:users';

const CanEditUser = ({user, userToEdit, children}) => {
  if (!user){
    return <p>Please log in.</p>;
  } else if (Users.can.edit(user, userToEdit)) {
    return children;
  } else {
    return <p>Sorry, you do not have permissions to edit this user at this time</p>;
  }
};

CanEditUser.propTypes = {
  user: React.PropTypes.object,
  userToEdit: React.PropTypes.object
}

CanEditUser.displayName = "CanEditUser";

module.exports = CanEditUser;