import React, { PropTypes, Component } from 'react';
import { composeWithTracker } from 'react-komposer';
import { Button, Modal } from 'react-bootstrap';
import Router from '../router.js';

import NovaForm from "meteor/nova:forms";

function composerUserProfileCheck(props, onData) {
  const currentUser = props.currentUser;
  const show = currentUser && !Users.hasCompletedProfile(currentUser) ? true : false; // force a bool value
  onData(null, { currentUser, show });
}

const UserProfileCheckModal = ({currentUser, show}) => {
    return !!currentUser ?
      (
        <Modal bsSize='small' show={ show }>
          <Modal.Header>
            <Modal.Title>Complete your Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NovaForm
              currentUser={ currentUser }
              collection={ Meteor.users }
              document={ currentUser }
              methodName="users.edit"
              labelFunction={ (fieldName)=>Telescope.utils.getFieldLabel(fieldName, Meteor.users) }
              successCallback={ (user) => Telescope.callbacks.runAsync("profileCompletedAsync", user) }
              fields={ ["telescope.email"] }
            />
          </Modal.Body>
          <Button bsStyle="primary" className="complete-profile-logout" onClick={ () => Meteor.logout(() => Router.go('/')) }>Log Out</Button>
        </Modal>
      ) : (null);
};

const UserProfileCheck = composeWithTracker(composerUserProfileCheck)(UserProfileCheckModal);

module.exports = UserProfileCheck;
export default UserProfileCheck;