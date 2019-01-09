import React from 'react';
import Users from 'meteor/vulcan:users';
import { Components, withRemove } from 'meteor/vulcan:core';

const AdminUsersActions = ({ document: user, removeMutation }) =>{

  const deleteHandler = e => {
    e.preventDefault();
    if (confirm(`Delete user ${Users.getDisplayName(user)}?`)) {
      removeMutation({documentId: user._id});
    }
  };

  return <Components.Button variant="primary" onClick={deleteHandler}>Delete</Components.Button>;
};

const removeOptions = {
  collection: Users
};

export default withRemove(removeOptions)(AdminUsersActions);

