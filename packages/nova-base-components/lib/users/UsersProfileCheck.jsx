import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap';
import Router from '../router.js';
import NovaForm from "meteor/nova:forms";

const UsersProfileCheckModal = ({currentUser, show}) => {

  // return fields that are required by the schema but haven't been filled out yet
  const schema = Users.simpleSchema()._schema;
  const requiredFields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return !!field.required && !Telescope.getNestedProperty(Meteor.user(), fieldName);
  });

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
          fields={ requiredFields }
        />
      </Modal.Body>
      <Modal.Footer>
        Or <a className="complete-profile-logout" onClick={ () => Meteor.logout(() => Router.go('/')) }>Log Out</a>
      </Modal.Footer>
    </Modal>
  )
};

class UsersProfileCheck extends Component {
  render() {
    const currentUser = this.context.currentUser;
    return currentUser ? <UsersProfileCheckModal currentUser={currentUser} show={!Users.hasCompletedProfile(currentUser)}/> : null
  }
}

UsersProfileCheck.contextTypes = {
  currentUser: React.PropTypes.object
}

UsersProfileCheck.displayName = "UsersProfileCheck";

module.exports = UsersProfileCheck;
export default UsersProfileCheck;