import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap';

import NovaForm from "meteor/nova:forms";

const UserProfileCheck = ({ currentUser }) => {
  return currentUser && !Users.hasCompletedProfile(currentUser) ?
    (<Modal bsSize='large' show={ true }>
      <Modal.Header closeButton>
        <Modal.Title>Complete your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NovaForm
          currentUser={ currentUser }
          collection={ Meteor.users }
          document={ currentUser }
          methodName="users.edit"
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Meteor.users)}
          successCallback={ (user)=> Telescope.callbacks.runAsync("profileCompletedAsync", user) }
        />
      </Modal.Body>
    </Modal>)
    : (null);
};

module.exports = UserProfileCheck;
export default UserProfileCheck;