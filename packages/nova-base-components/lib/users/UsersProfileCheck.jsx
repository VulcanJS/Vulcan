import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Users from 'meteor/nova:users';
import { Accounts } from 'meteor/std:accounts-ui';

const UsersProfileCheckModal = ({show, router}, {currentUser}) => {

  // return fields that are required by the schema but haven't been filled out yet
  const schema = Users.simpleSchema()._schema;
  const requiredFields = _.filter(_.keys(schema), (fieldName) => {
    var field = schema[fieldName];
    return !!field.required && !Telescope.getNestedProperty(currentUser, fieldName);
  });

  return (
    <Modal bsSize='small' show={ show }>
      <Modal.Header>
        <Modal.Title><FormattedMessage id="users.complete_profile"/></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NovaForm
          collection={ Users }
          document={ currentUser }
          methodName="users.edit"
          successCallback={ (user) => Telescope.callbacks.runAsync("users.profileCompleted.async", user) }
          fields={ requiredFields }
        />
      </Modal.Body>
      <Modal.Footer>
        <FormattedMessage id="app.or"/> <a className="complete-profile-logout" onClick={ () => Meteor.logout(Accounts.ui._options.onSignedOutHook()) }><FormattedMessage id="users.log_out"/></a>
      </Modal.Footer>
    </Modal>
  )
};

const UsersProfileCheck = (props, {currentUser}) => {
  return currentUser ? <UsersProfileCheckModal show={!Users.hasCompletedProfile(currentUser)}/> : null;
};

UsersProfileCheck.contextTypes = {
  currentUser: React.PropTypes.object
};

UsersProfileCheckModal.contextTypes = {
  currentUser: React.PropTypes.object
};

UsersProfileCheck.displayName = "UsersProfileCheck";

module.exports = withRouter(UsersProfileCheck);
export default withRouter(UsersProfileCheck);