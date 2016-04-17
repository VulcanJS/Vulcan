import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap';
import Router from '../router.js';
import NovaForm from "meteor/nova:forms";

const UserProfileCheckModal = ({currentUser, show}) => {
  return (
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
      <Modal.Footer>
        Or <a className="complete-profile-logout" onClick={ () => Meteor.logout(() => Router.go('/')) }>Log Out</a>
      </Modal.Footer>
    </Modal>
  )
};

class UserProfileCheck extends Component {
  render() {
    const currentUser = this.context.currentUser;
    return currentUser ? <UserProfileCheckModal currentUser={currentUser} show={!Users.hasCompletedProfile(currentUser)}/> : null
  }
}

UserProfileCheck.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = UserProfileCheck;
export default UserProfileCheck;