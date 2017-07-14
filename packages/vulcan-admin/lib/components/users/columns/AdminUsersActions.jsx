import React from 'react';
import Users from 'meteor/vulcan:users';
import { Components, withRemove } from 'meteor/vulcan:core';
import Button from 'react-bootstrap/lib/Button';

const AdminUsersActions = ({ user, removeMutation }) =>{

  const deleteHandler = e => {
    e.preventDefault();
    if (confirm(`Delete user ${Users.getDisplayName(user)}?`)) {
      removeMutation({documentId: user._id});
    }
  }

  return <Button bsStyle="primary" onClick={deleteHandler}>Delete</Button>
}

const removeOptions = {
  collection: Users
}

export default withRemove(removeOptions)(AdminUsersActions);

