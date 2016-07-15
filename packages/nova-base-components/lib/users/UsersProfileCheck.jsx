import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Users from 'meteor/nova:users';

const UsersProfileCheckModal = ({currentUser, show, router}) => {

  // return fields that are required by the schema but haven't been filled out yet
  const schema = Users.simpleSchema()._schema;
  const requiredFields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return !!field.required && !Telescope.getNestedProperty(Meteor.user(), fieldName);
  });

  return (
    <Modal bsSize='small' show={ show }>
      <Modal.Header>
        <Modal.Title><FormattedMessage id="users.complete_profile"/></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NovaForm
          currentUser={ currentUser }
          collection={ Meteor.users }
          document={ currentUser }
          methodName="users.edit"
          successCallback={ (user) => Telescope.callbacks.runAsync("profileCompletedAsync", user) }
          fields={ requiredFields }
        />
      </Modal.Body>
      <Modal.Footer>
        <FormattedMessage id="app.or"/> <a className="complete-profile-logout" onClick={ () => Meteor.logout(() => router.push({pathname: '/'})) }><FormattedMessage id="users.log_out"/></a>
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

module.exports = withRouter(UsersProfileCheck);
export default withRouter(UsersProfileCheck);